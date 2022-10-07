import { ReactNode, useEffect, useState } from 'react'

import LocationContext from '../contexts/LocationContext'

interface Props {
  children: ReactNode
}

function Router({ children }: Props) {
  const [currentPath, setCurrentPath] = useState(location.pathname)

  const setLocation = (pathname: string) => {
    setCurrentPath(pathname)
  }

  return (
    <LocationContext.Provider value={{ location: currentPath, setLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export default Router
