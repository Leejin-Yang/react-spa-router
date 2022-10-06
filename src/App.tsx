import AboutPage from './pages/AboutPage'
import RootPage from './pages/RootPage'

function App() {
  const { pathname } = window.location

  if (pathname === '/about') {
    return <AboutPage />
  }

  return <RootPage />
}

export default App
