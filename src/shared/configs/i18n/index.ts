import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const isDev = import.meta.env.DEV

const options = {
  fallbackLng: 'en',
  debug: isDev, // Включаем debug режим только в разработке

  interpolation: {
    escapeValue: false // React уже делает экранирование по умолчанию
  },
  backend: {
    // Дополнительные настройки для backend можно задать здесь
  },
  detection: {
    // Дополнительные настройки для language detector можно задать здесь
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(options)

export default i18n
