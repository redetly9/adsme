import type { UserGeoType } from '~model/user-model/types'

export const getUserLocation = (): Promise<UserGeoType> => {
  return new Promise((resolve, reject) => {
    // Проверяем, доступна ли геолокация в браузере пользователя
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser')
    } else {
      // Получаем текущую позицию
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          reject('Unable to retrieve your location')
        }
      )
    }
  })
}
