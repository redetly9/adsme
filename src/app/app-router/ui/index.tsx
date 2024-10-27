import { Route, Routes } from 'react-router-dom'

import { WithAuthCheck } from '~app/hocs/with-auth-token-check'
import { WithGeoCheck } from '~app/hocs/with-geo-check'
import { AppRouterConfig, RoutesPath } from '~shared/configs/app-router-config'

export const AppRouter = () => {
  return (
    <Routes>
      {AppRouterConfig.map((r, rIndex) => {
        const elementWithCheck = r.path === RoutesPath.sign_in ? r.element : <WithAuthCheck element={r.element} />

        return (
          <Route
            key={`main_route_${r.path}_${rIndex}`}
            path={r.path}
            element={
              <WithGeoCheck>
                {elementWithCheck}
              </WithGeoCheck>
            }
          >
            {r.children?.map((child, childIndex) => {
              return (
                <Route
                  key={`child_route_${child.path}_${childIndex}`}
                  path={child.path}
                  element={
                    <WithGeoCheck>
                      <WithAuthCheck element={child.element} />
                    </WithGeoCheck>
                  }
                />
              )
            })}
          </Route>
        )
      })}
    </Routes>
  )
}
