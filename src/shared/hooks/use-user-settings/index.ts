import { useCallback, useEffect, useState } from 'react'

import { getSettingsApi, updateSettingsApi } from '~shared/api'
import type { SettingsType, UpdateSettings } from '~shared/types/settings'

export const useUserSettings = (userId: string | null | undefined) => {
  const [userSettings, setUserSettings] = useState<SettingsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getSettings = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const response = await getSettingsApi(userId)
      if (response && 'data' in response) {
        setUserSettings(response.data)
      }
    } catch (e) {
      console.error('Error fetching user settings:', e)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const updateSettings = useCallback(async (settings: UpdateSettings) => {
    try {
      setIsLoading(true)
      await updateSettingsApi(settings)
      getSettings()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [getSettings])

  useEffect(() => {
    getSettings()
  }, [getSettings])

  return {
    isLoading,
    userSettings,
    updateSettings
  }
}
