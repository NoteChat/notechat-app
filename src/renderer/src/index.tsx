import React from 'react'
import ReactDOM from 'react-dom/client'
import 'virtual:uno.css'
import './styles/common.css'
import './styles/radix.css'
import '@vscode/codicons/dist/codicon.css'
import 'highlight.js/styles/github.css'

import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/user/login'
import Register from './pages/user/register'
import { App } from './app'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'
import { Toaster } from 'react-hot-toast'
import ResetPwd from './pages/user/reset-pwd'
import FindPwd from './pages/user/find-pwd'
import { getLocale } from './utils'


const locale = getLocale();

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en,
      'zh-CN': zhCN
    },
    lng: locale, // if you're using a language detector, do not define the lng option
    fallbackLng: locale,
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/*" Component={App} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-pwd" element={<FindPwd />} />
        <Route path="/reset-pwd" element={<ResetPwd />} />
      </Routes>
    </HashRouter>
    <Toaster />
  </React.StrictMode>
)
