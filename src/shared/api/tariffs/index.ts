import axios from 'axios'

import { supabase } from '~shared/api/supabase'
import type { TariffsInvoiceType, TariffsType } from '~shared/types/tariffs'

export const getTariffs = async (): Promise<{ data: TariffsType[] } | { error: any }> => {
  const { data, error } = await supabase
    .from('tariffs')
    .select('*')

  if (error) {
    console.error('Ошибка при получении тарифов:', error.message)
    return { error }
  }

  return { data }
}

export const createInvoice = (args: { userId: number, tariffId: number }) => {
  return axios.post<TariffsInvoiceType>('https://eziznurhenjecbvtduub.supabase.co/functions/v1/create-invoice', {
    tariff_id: args.tariffId,
    user_id: args.userId,
    return_url: 'https://adsme.vercel.app'
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
