import Route from './components/Route'
import Router from './components/Router'

import AboutPage from './pages/AboutPage'
import RootPage from './pages/RootPage'

function App() {
  return (
    <Router>
      <Route path='/' component={<RootPage />} />
      <Route path='/about' component={<AboutPage />} />
    </Router>
  )
}

export default App
