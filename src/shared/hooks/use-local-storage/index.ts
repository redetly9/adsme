import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T | ((prevValue: T | undefined) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value: T | ((prevValue: T | undefined) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))

      /**
       * на это событие подписываемся по умолчанию при использовании useLocalStorageEvent
       * */
      window.dispatchEvent(new Event('localStorageChange'))
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error)
    }
  }

  // Подписка на изменения localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}
