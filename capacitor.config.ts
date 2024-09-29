import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.adsme',
  appName: 'Adsme_new',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      androidLocationPermissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION'
      ],
      iosLocationPermissions: {
        NSLocationWhenInUseUsageDescription: 'Мы используем ваше местоположение для предоставления лучших услуг'
      }
    },
    SplashScreen: {
      launchShowDuration: 2000, // Продолжительность отображения сплэшскрина (в миллисекундах)
      launchAutoHide: true, // Автоматически скрывать сплэшскрин
      backgroundColor: '#ffffff', // Цвет фона
      androidScaleType: 'CENTER_CROP', // Способ масштабирования изображения на Android
      showSpinner: false, // Показывать индикатор загрузки (false для отключения)
      iosSpinnerStyle: 'small', // Стиль индикатора загрузки для iOS
      spinnerColor: '#ffffff' // Цвет индикатора загрузки
    }
  }
}

export default config
