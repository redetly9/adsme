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
