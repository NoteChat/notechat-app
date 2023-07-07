import React from 'react'
import ReactDOM from 'react-dom/client'
import 'virtual:uno.css'
import './styles/settings.css'
import './styles/login.css'
import './styles/common.css'

import { HashRouter, Route, Routes } from 'react-router-dom'
import Settings from './pages/settings'
import Login from './pages/login'
import Register from './pages/register'

// if (window.api) {
//   window.api.on('open-login', () => {
//     console.log('open Window')
//   });
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="*" index element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
