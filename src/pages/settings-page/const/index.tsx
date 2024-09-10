import type { ReactNode } from 'react'

import { SettingsNotificationsTab } from '~pages/settings-page/components/settings-notifications-tab'

import { SettingsMainTab } from '../components/settings-main-tab'
import { SettingsUserTab } from '../components/settings-user-tab'

export enum SettingsTabNames {
  main = 'main_settings',
  user = 'user_settings',
  notifications = 'notifications_settings'
}

export const SettingsTabs: Record<SettingsTabNames, ReactNode> = {
  [SettingsTabNames.main]: <SettingsMainTab />,
  [SettingsTabNames.user]: <SettingsUserTab />,
  [SettingsTabNames.notifications]: <SettingsNotificationsTab />
}
