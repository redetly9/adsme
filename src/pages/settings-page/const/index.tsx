import type { ReactNode } from 'react'

import { SettingsMainTab } from '../components/settings-main-tab'
import { SettingsUserTab } from '../components/settings-user-tab'

export enum SettingsTabNames {
  main = 'main_settings',
  user = 'user_settings'
}

export const SettingsTabs: Record<SettingsTabNames, ReactNode> = {
  [SettingsTabNames.main]: <SettingsMainTab />,
  [SettingsTabNames.user]: <SettingsUserTab />
}
