import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'

function RootPage() {
  const { setLocation } = useContext(LocationContext)

  const onClick = () => {
    history.pushState(null, '', '/about')
    setLocation(location.pathname)
  }

  return (
    <main>
      <h1>root</h1>
      <button type='button' onClick={onClick}>
        about
      </button>
    </main>
  )
}

export default RootPage
