import { useContext, useEffect } from 'react'

import LocationContext from '../contexts/LocationContext'

export function useRouter() {
  const { setLocation } = useContext(LocationContext)

  const push = (path: string) => {
    history.pushState(null, '', path)
    setLocation(location.pathname)
  }

  useEffect(() => {
    const onPopState = () => {
      setLocation(location.pathname)
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return { push }
}
