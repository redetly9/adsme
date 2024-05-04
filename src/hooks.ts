import { supabase } from "./api";

// Функция регистрации пользователя
export async function registerUser(phone) {
  // Проверяем, существует ли пользователь
  let { data: existingUser, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (findError && findError.message !== 'Item not found') {
    console.error('Ошибка при поиске пользователя:', findError.message);
    return { error: findError };
  }

  if (existingUser) {
    return { data: { message: 'Пользователь уже существует. Отправьте код верификации.' } };
  }

  // Создаем нового пользователя
  let { data: newUser, error: createError } = await supabase
    .from('user_profiles')
    .insert([
      { phone }
    ]);

  if (createError) {
    console.error('Ошибка при создании пользователя:', createError.message);
    return { error: createError };
  }

  return { data: newUser };
}

// Функция для верификации пользователя
export async function verifyUser(phone, code) {
  if (code !== '1111') {  // Здесь можно заменить на проверку с реальным кодом, если необходимо
    return { error: { message: 'Неверный код верификации.' } };
  }

  let { data: user, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .single();

  if (findError) {
    console.error('Ошибка при поиске пользователя:', findError.message);
    return { error: findError };
  }

  if (!user) {
    return { error: { message: 'Пользователь не найден.' } };
  }

  // Симуляция создания токена (в реальном проекте нужен сервер для безопасности)
  const fakeToken = `fake-jwt-token-for-${user.id}`;

  return { data: { token: fakeToken, user } };
}

export async function createChat(participants) {
  // Проверяем, существует ли уже чат с данными участниками
  const existingChat = await checkExistingChat(participants);

  if (existingChat.error) {
    console.error('Ошибка при проверке существующего чата:', existingChat.error.message);
    return { error: existingChat.error };
  }

  // Если чат существует, возвращаем его
  if (existingChat.data) {
    return { data: existingChat.data };
  }

  // Если чата не существует, создаем новый
  let { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert([{}])
    .single();

  if (chatError) {
    console.error('Ошибка при создании чата:', chatError.message);
    return { error: chatError };
  }

  // Добавляем участников к новому чату
  const participantRecords = participants.map(userId => ({
    chat_id: chat.id,
    user_profile_id: userId
  }));

  let { error: participantsError } = await supabase
    .from('chat_participants')
    .insert(participantRecords);

  if (participantsError) {
    console.error('Ошибка при добавлении участников:', participantsError.message);
    return { error: participantsError };
  }

  return { data: chat };
}

async function checkExistingChat(participants) {
  // Для простоты предположим, что у нас есть таблица `chat_participants`
  // и в ней есть колонки `chat_id` и `user_profile_id`.
  // Мы ищем чаты, где есть все участники из списка `participants`.

  // Сначала находим все чаты, где есть хотя бы один участник
  let { data: chats, error } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .in('user_profile_id', participants);

  if (error || !chats.length) {
    return { error: error || new Error("No chats found for the participants.") };
  }

  // Теперь находим чаты, где количество участников совпадает с количеством переданных участников
  const chatIds = chats.map(chat => chat.chat_id);
  const { data: validChats, error: validChatsError } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .in('chat_id', chatIds)
    .group('chat_id')
    .having('count(user_profile_id)', 'eq', participants.length);

  if (validChatsError || !validChats.length) {
    return { error: validChatsError || new Error("No valid chats found with the exact participants.") };
  }

  // Возвращаем первый подходящий чат
  const validChatId = validChats[0].chat_id;
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('*')
    .eq('id', validChatId)
    .single();

  if (chatError) {
    return { error: chatError };
  }

  return { data: chat };
}


export async function getUserChats(userId) {
  let { data: chats, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages: messages(*),
      sender: user_profiles!chats_user_id_fkey(*)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Ошибка при получении чатов:', error.message);
    return { error };
  }

  return { data: chats };
}

// Функция для получения сообщений чата
export async function getChatMessages(chatId) {
  let { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender: user_profiles (name, avatar)
    `)
    .eq('chat_id', chatId);

  if (error) {
    console.error('Ошибка при получении сообщений:', error.message);
    return { error };
  }

  return { data: messages };
}

// Функция для отправки сообщения в чат
export async function sendMessage(chatId, senderId, text) {
  let { data: message, error } = await supabase
    .from('messages')
    .insert([
      { chat_id: chatId, sender_id: senderId, text }
    ]);

  if (error) {
    console.error('Ошибка при отправке сообщения:', error.message);
    return { error };
  }

  return { data: message };
}

// users
export async function getAllUsers() {
  let { data: users, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) {
    console.error('Ошибка при получении пользователей:', error.message);
    return { error };
  }

  return { data: users };
}

export async function getUserById(userId) {
  let { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Ошибка при получении пользователя:', error.message);
    return { error };
  }

  return { data: user };
}

export async function updateUser(userId, updateData) {
  let { data: updatedUser, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Ошибка при обновлении пользователя:', error.message);
    return { error };
  }

  return { data: updatedUser };
}

// Получение всех постов с фильтрацией по геолокации
export async function getPostsByLocation(longitude, latitude, radius = 1000) {
  let { data: posts, error } = await supabase
    .rpc('get_posts_by_location2', { long: longitude, lat: latitude, rad: radius })
    .select('*')

  if (error) {
    console.error('Ошибка при получении постов:', error.message);
    return { error };
  }

  const mapped = posts?.map(p => ({
    "id": p.id,
    "title": p.title,
    "images": p.images,
    "tags": p.tags,
    "created_at": p.created_at,
    "author": {
      "id": p.author_id,
      "name": p.author_name,
      "avatar": p.avatar,
      "surname": p.author_surname,
      "lastname": p.author_lastname,
    },
  }))

  return { data: mapped };
}


// Получение всех постов с фильтрацией по геолокации
export async function getPostsByTag(tag) {
  let { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (*)
    `)
    .ilike('tags', `%${tag}%`);

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message);
    return { error };
  }

  return { data: posts };
}

// Добавление нового поста
export async function createPost({ title, images, tags, longitude, latitude, author }) {
  let { data: newPost, error } = await supabase
    .from('posts')
    .insert([{
      title,
      images,
      tags,
      location: `POINT(${longitude} ${latitude})`,
      author: author
    }])
    .select()

  if (error) {
    console.error('Ошибка при создании поста:', error.message);
    return { error };
  }

  return { data: newPost };
}

// Удаление поста
export async function deletePost(postId) {
  let { data: deletedPost, error } = await supabase
    .from('posts')
    .delete()
    .match({ id: postId });

  if (error) {
    console.error('Ошибка при удалении поста:', error.message);
    return { error };
  }

  return { data: deletedPost };
}
