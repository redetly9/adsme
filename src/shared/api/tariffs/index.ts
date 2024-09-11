import { supabase } from '~shared/api/supabase'
import type { TariffsType } from '~shared/types/tariffs'

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
