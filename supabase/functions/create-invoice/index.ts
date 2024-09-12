import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode } from "https://deno.land/std@0.103.0/encoding/base64.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
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

  const body = await req.json()
  const { tariff_id, user_id, return_url } = body;

  console.log('req', body);
  

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );

  try {
    const { data: tariff, error: orderError } = await supabase
    .from('tariffs')
    .select('*')
    .eq('id', tariff_id)
    .single()

    if (orderError) {
      throw new Error(`Error fetching order items: ${orderError.message}`);
    }
    console.log('tariff', tariff);



    const totalAmount = tariff.price;
    console.log('totalAmount', totalAmount);

    // Подготовка данных для createPayment
    const shopId = '871001';
    const secretKey = 'test_4mKfIbYzChjzczQ6Z3TKDf_OUkd5c-Q6Lxc36LsWKIw';

    function generateIdempotenceKey() {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function toBase64(str) {
      return encode(new TextEncoder().encode(str));
    }

    const idempotenceKey = generateIdempotenceKey();
    const url = 'https://api.yookassa.ru/v3/payments';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${toBase64(`${shopId}:${secretKey}`)}`,
      'Idempotence-Key': idempotenceKey,
    };

    const body = JSON.stringify({
      "amount": {
        "value": `${totalAmount}`,
        "currency": "RUB"
      },
      "capture": true,
      "confirmation": {
        "type": "redirect",
        "return_url": return_url
      },
      "description": `${totalAmount}`,
      "receipt": {
        "customer": {
          "full_name": "Иванов Иван Иванович",
          "email": "ivanov@example.com",
          "phone": "79000000000"
        },
        "items": [
          {
            "description": `Предоплата ${totalAmount}`,
            "quantity": "1.00",
            "amount": {
              "value": `${totalAmount}`,
              "currency": "RUB"
            },
            "vat_code": "1",
            "payment_mode": "full_prepayment",
            "payment_subject": "commodity"
          }
        ]
      }
    });

    const paymentResponse = await fetch(url, { method: 'POST', headers, body });
    const paymentData = await paymentResponse.json();

    const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      status: 'pending',
      total: totalAmount,
      external_id: paymentData.id,
      user_id
    })
    .select('*')
    .single()

    if (transactionError) {
      throw new Error(`Error creating transaction: ${transactionError.message}`);
    }

    if (!paymentResponse.ok) {
      throw new Error(`Error creating payment: ${paymentData.description}`);
    }

    return new Response(
      JSON.stringify(paymentData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-invoice' \
    --header 'Authorization: Bearer YOUR_SUPABASE_KEY' \
    --header 'Content-Type: application/json' \
    --data '{"order_id":"your_order_id_here"}'

*/
