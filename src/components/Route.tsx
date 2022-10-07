import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'
import type { LocationContextObject } from '../contexts/LocationContext'

interface Props {
  path: LocationContextObject['location']
  component: JSX.Element
}

function Route({ path, component }: Props) {
  const { location } = useContext(LocationContext)

  if (location !== path) {
    return null
  }

  return component
}

export default Route
