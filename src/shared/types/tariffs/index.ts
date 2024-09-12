export enum TariffsTypeNames {
  ONE_MONTH = '1month',
  THREE_MONTH = '3month',
  SIX_MONTH = '6month',
  ONE_YEAR = '12month'
}

export type TariffsType = {
  id: number,
  created_at: string,
  period: number,
  name: TariffsTypeNames,
  price: number
}

export type TariffsInvoiceType = {
  id: string, // 2e744e6d-000f-5000-a000-1fa0ba83e731,
  status: string, //pending,
  amount: {
    value: string, //100.00,
    currency: string//RUB
  },
  description: string, //100,
  recipient: {
    account_id: string, //871001,
    gateway_id: string//1936985
  },
  created_at: string, //2024-09-12T00:49:49.325Z,
  confirmation: {
    type: string, //redirect,
    confirmation_url: string//https://yoomoney.ru/checkout/payments/v2/contract?orderId=2e744e6d-000f-5000-a000-1fa0ba83e731
  },
  test: boolean,
  paid: boolean,
  refundable: boolean,
  metadata: unknown
}
