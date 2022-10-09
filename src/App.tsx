import Route from './components/Route'
import Routes from './components/Routes'

import AboutPage from './pages/AboutPage'
import RootPage from './pages/RootPage'

function App() {
  return (
    <Routes>
      <Route path='/' component={<RootPage />} />
      <Route path='/about' component={<AboutPage />} />
    </Routes>
  )
}

export default App
