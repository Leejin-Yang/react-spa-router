import { createContext } from 'react'

export interface LocationContextObject {
  location: string
  setLocation: (pathname: string) => void
}

const LocationContext = createContext<LocationContextObject>(null!)

export default LocationContext
