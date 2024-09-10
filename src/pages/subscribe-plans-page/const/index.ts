export enum SubscribePricesCardsIds {
  ONE_MONTH = 'ONE_MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  TWELVE_MONTHS = 'TWELVE_MONTHS'
}

export const subscribePricesCards: Array<{ id: SubscribePricesCardsIds, label: string, price: string }> = [
  {
    id: SubscribePricesCardsIds.ONE_MONTH,
    label: 'Подписка на 1 месяц',
    price: '1$'
  },
  {
    id: SubscribePricesCardsIds.THREE_MONTHS,
    label: 'Подписка на 3 месяца',
    price: '2.7$'
  },
  {
    id: SubscribePricesCardsIds.SIX_MONTHS,
    label: 'Подписка на 6 месяцев месяцев',
    price: '5.3$'
  },
  {
    id: SubscribePricesCardsIds.TWELVE_MONTHS,
    label: 'Подписка на 12 месяцев',
    price: '9$'
  }
]
