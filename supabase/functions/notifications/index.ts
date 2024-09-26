import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// URL для отправки уведомлений
const notificationUrl = "https://likeable-tartan-leech.glitch.me/send-notification";

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      };
      return new Response('ok', { headers: corsHeaders });
    }
  
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    const { record } = await req.json();  // данные о новом сообщении

    const { chat_id, text, sender_id: user_profile_id } = record;  // предполагаем, что такие поля есть в messages

    // 1. Получаем всех участников чата из таблицы `chat_participants`
    const { data: participants, error: participantsError } = await supabase
      .from('chat_participants')
      .select('user_profile_id')
      .eq('chat_id', chat_id);

    if (participantsError) {
      console.error(participantsError);
      return new Response("Ошибка при получении участников чата", { status: 500, headers: corsHeaders });
    }

    // 2. Получаем информацию о профиле отправителя
    const { data: senderProfile, error: senderError } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('id', user_profile_id)
      .single();

    if (senderError || !senderProfile) {
      console.error(senderError);
      return new Response("Ошибка при получении профиля отправителя", { status: 500, headers: corsHeaders });
    }

    // 3. Проходим по каждому участнику и ищем их токены в таблице `notification_manager`
    for (const participant of participants) {
      const { data: notificationData, error: notificationError } = await supabase
        .from('notification_manager')
        .select('token')
        .eq('user_id', participant.user_profile_id);

      if (notificationError || !notificationData || notificationData.length === 0) {
        console.error(notificationError);
        continue;  // пропускаем пользователя, если у него нет токена или возникла ошибка
      }

      // 4. Формируем тело запроса для каждого участника
      const payload = {
        token: notificationData[0].token,  // Токен пользователя
        title: `Новое сообщение от ${senderProfile.name}`,
        body: text,
        data: {
          user_id: participant.user_profile_id.toString(),
          title: `Новое сообщение от ${senderProfile.name}`,
          body: text,
        },
      };

      // 5. Отправляем POST-запрос на URL уведомлений
      try {
        const response = await fetch(notificationUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log(`Уведомление успешно отправлено для user_id: ${participant.user_profile_id}`);
        } else {
          console.error(`Ошибка при отправке уведомления для user_id: ${participant.user_profile_id}`, await response.text());
        }
      } catch (error) {
        console.error(`Ошибка при отправке HTTP-запроса для user_id: ${participant.user_profile_id}`, error);
      }
    }

    return new Response("Push-уведомления отправлены", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Ошибка:", error);
    return new Response("Ошибка при отправке уведомлений", { status: 500 });
  }
});
