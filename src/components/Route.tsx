import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'
import type { LocationContextObject } from '../contexts/LocationContext'

export interface RouteProps {
  path: LocationContextObject['location']
  component: JSX.Element
}

// 에러 처리 전용 컴포넌트
// 아래 코드는 동작하지 않는다.

function Route({ path, component }: RouteProps) {
  const { location } = useContext(LocationContext)

  if (location !== path) {
    return null
  }

  return component
}

export default Route
