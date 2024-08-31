export const formatPhoneNumber = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '')
  // Разделение номера на части и соединение с нужными разделителями
  const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  // Возврат отформатированного номера или оригинального значения, если формат не соответствует ожидаемому
  return match ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}${match[5]}` : phoneNumber
}
