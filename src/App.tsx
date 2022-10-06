import { createContext, useEffect, useState } from 'react'

import AboutPage from './pages/AboutPage'
import RootPage from './pages/RootPage'

interface LocationContextObject {
  basename: string
  setLocation: (pathname: string) => void
}

export const LocationContext = createContext<LocationContextObject>(null!)

function App() {
  const [basename, setBasename] = useState(location.pathname)

  const setLocation = (pathname: string) => {
    setBasename(pathname)
  }

  useEffect(() => {
    const onPopState = () => {
      setBasename(location.pathname)
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return (
    <LocationContext.Provider value={{ basename, setLocation }}>
      {basename === '/about' ? <AboutPage /> : <RootPage />}
    </LocationContext.Provider>
  )
}

export default App
