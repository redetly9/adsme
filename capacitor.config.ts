import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.adsme.apps',
  appName: 'Adsme',
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
    }
  }
}

export default config
