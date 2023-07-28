import React, { useCallback, useEffect, useState } from 'react'
import { Sidebar } from './components/sidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ChatMessageType, Chat } from './pages/chat'

import Prompt from './pages/prompt'
import style from './style.module.css'
import { Setting } from './pages/setting'
import API, { PromptDto } from '@renderer/api'
import { Editor } from './pages/editor'
import { Favorite } from './pages/favorite'
// import { Keywords } from './pages/keywords'

export interface IAppProps {
  loadPrompts: () => void
  prompts: PromptDto[]
}

function initialMessages() {
    const chatHistory = localStorage.getItem('chatHistory');
    let chatMessage:  ChatMessageType[] = [];
    if (chatHistory) {
        chatMessage = JSON.parse(chatHistory);
    }
    return chatMessage;
}

export function storeMessages(messages: ChatMessageType[]) {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

export const App: React.FC<React.PropsWithChildren> = React.memo(() => {
  const navigate = useNavigate()
  const [prompts, setPrompts] = useState<PromptDto[]>([])
  const [messages, setMessages] = React.useState<ChatMessageType[]>(initialMessages())

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
          <Route index path="/" element={<Chat prompts={prompts} messages={messages} setMessages={setMessages}/> } />
          <Route path="/chat" element={<Chat prompts={prompts} messages={messages} setMessages={setMessages}/>} />
          <Route path="/editor" index Component={Editor} />
          {/* <Route path="/keywords" Component={Keywords} /> */}
          <Route path="/favorite" element={<Favorite />} />
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
