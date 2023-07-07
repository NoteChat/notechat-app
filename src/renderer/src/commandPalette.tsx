import React from 'react'
import ReactDOM from 'react-dom/client'
import 'virtual:uno.css'
import './styles/login.css'
import './styles/common.css'

import { CommandPalette } from './pages/commandPalette'

if (window.api) {
  const uid = localStorage.getItem('uid')
  if (!uid) {
    window.api.send('open-login')
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CommandPalette />
  </React.StrictMode>
)
