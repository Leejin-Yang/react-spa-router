import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'

export function useRouter() {
  const { setLocation } = useContext(LocationContext)

  const push = (path: string) => {
    history.pushState(null, '', path)
    setLocation(location.pathname)
  }

  return { push }
}
