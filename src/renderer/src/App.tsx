import Versions from './components/Versions'

import Login from './pages/login'

function App(): JSX.Element {
  return (
    <div className="container">
      <Versions></Versions>
      <Login></Login>
    </div>
  )
}

export default App
