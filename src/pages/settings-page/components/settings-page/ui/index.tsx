import './index.scss'

import { Box, Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SettingsTabNames, SettingsTabs } from '~pages/settings-page/const'
import { PageHeader } from '~shared/ui/page-header'

export const SettingsPage = () => {
  const { t } = useTranslation()
  const [tabsValue, setTabsValue] = useState(SettingsTabNames.main)

  return (
    <Box className='SettingsPage'>
      <PageHeader
        withRightSideAction={false}
        title={t('Настройки')}
      />
      <Tabs
        variant='fullWidth'
        value={tabsValue}
        onChange={(_, value) => setTabsValue(value)}
      >
        <Tab
          label={t('Главная')}
          value={SettingsTabNames.main}
        />
        <Tab
          label={t('Пользователь')}
          value={SettingsTabNames.user}
        />
      </Tabs>
      <Box className='SettingsPage-content'>
        {SettingsTabs[tabsValue]}
      </Box>
    </Box>
  )
}
