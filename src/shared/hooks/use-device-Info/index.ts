import { Device } from '@capacitor/device'
import { useEffect } from 'react'

import { useUserStore } from '~model/user-model'
import { addUserDevice } from '~shared/api/user-api'

export const useDeviceInfo = () => {
  const user = useUserStore(state => state.user)

  useEffect(() => {

    (async () => {
      if (!user?.id) return

      const deviceInfo = await Device.getInfo()
      const deviceId = await Device.getId()
      addUserDevice({
        user_id: user.id.toString(),
        device_id: deviceId.identifier, //на ios это по сути uuid, на андроиде по разному
        platform: deviceInfo.platform
      })
    })()

  }, [user?.id])
}
