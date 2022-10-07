import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'

function AboutPage() {
  const { setLocation } = useContext(LocationContext)

  const onClick = () => {
    history.pushState(null, '', '/')
    setLocation(location.pathname)
  }

  return (
    <main>
      <h1>about</h1>
      <button type='button' onClick={onClick}>
        go main
      </button>
    </main>
  )
}

export default AboutPage
