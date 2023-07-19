import React, { useCallback, useEffect, useState } from 'react'
import { Sidebar } from './components/sidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Chat } from './pages/chat'
import { Text } from './pages/text'
import { Clone } from './pages/clone'
import Prompt from './pages/prompt'
import style from './style.module.css'
import { Setting } from './pages/setting'
import API, { PromptDto } from '@renderer/api'

export interface IAppProps {
  loadPrompts: () => void
  prompts: PromptDto[]
}

export const App: React.FC<React.PropsWithChildren> = React.memo(() => {
  const navigate = useNavigate()
  const [prompts, setPrompts] = useState<PromptDto[]>([])

  const loadPrompts = useCallback(function() {
    const uid = localStorage.getItem('uid')
    if (uid) {
      API.v1
        .getPrompt({
          userId: Number(uid),
          limit: 100
        })
        .then((res) => {
          if (res.ok) {
            setPrompts(res.data as any)
          }
        })
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    if (prompts.length === 0) {
      loadPrompts()
    }
  }, [])

  return (
    <div className="w-full h-full">
      <Sidebar />
      <div className={style['main']}>
        <Routes>
          <Route index path="/" element={<Chat />} />
          <Route path="/chat" Component={Chat} />
          <Route path="/clone" index Component={Clone} />
          <Route path="/text" element={<Text prompts={prompts} loadPrompts={loadPrompts} />} />
          <Route
            path="/prompt/*"
            element={<Prompt prompts={prompts} loadPrompts={loadPrompts} />}
          />
          <Route path="/setting" Component={Setting} />
        </Routes>
      </div>
    </div>
  )
})
