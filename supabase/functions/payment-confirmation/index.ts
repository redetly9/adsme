import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

  const { object } = await req.json();
  console.log('req.body', object);
  console.log('ID', object.id, object.status);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );

  try {
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('external_id', object.id)
      .single()

    if (transactionError) {
      throw new Error(`Error creating transaction: ${transactionError.message}`);
    }


    const { error: userLicensesError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: transaction.user_id,
        status: 'active',
      })

    if (userLicensesError) {
      throw new Error(`Error fetching order items: ${userLicensesError.message}`);
    }

    const { error: transactionUpdateError } = await supabase
      .from('transactions')
      .update({
        status: 'paid'
      })
      .eq('external_id', object.id)

    if (transactionUpdateError) {
      throw new Error(`Error fetching order items: ${transactionUpdateError.message}`);
    }



    return new Response(
      JSON.stringify(transaction),
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
