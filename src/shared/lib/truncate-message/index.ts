export const truncateMessage = (message: string, maxLength = 20) => {
  if (!message || message.length <= maxLength) return message
  return message.slice(0, maxLength) + '...'
}
