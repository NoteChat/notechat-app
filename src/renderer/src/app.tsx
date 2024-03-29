import React from 'react'
import { Sidebar } from './components/sidebar'
import { Route, Routes } from 'react-router-dom'
import { Chat } from './pages/chat'

import Prompt from './pages/prompt'
import style from './style.module.css'
import { Setting } from './pages/setting'
import { PromptDto } from '@renderer/api'
import { GlobalEditor } from './pages/editor'
import { Favorite } from './pages/favorite'
import { Keywords } from './pages/keywords'
import { ChatProvider } from './context/chat'
import { PromptsProvider } from './context/prompts'
import { FavoriteEdit } from './pages/favorite/edit'
import { EditorProvider } from './context/editor'
import { UserProvider } from './context/user'

export interface IAppProps {
  loadPrompts?: () => void
  prompts: PromptDto[]
}

export const App: React.FC<React.PropsWithChildren> = React.memo(() => {
  const ChatPage = (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  )

  return (
    <div className="w-full h-full">
      <UserProvider>
        <Sidebar />
        <div className={style['main']}>
          <PromptsProvider>
            <Routes>
              <Route index path="/" element={ChatPage} />
              <Route path="/chat" element={ChatPage} />
              <Route
                path="/document"
                index
                element={
                  <EditorProvider>
                    <GlobalEditor />
                  </EditorProvider>
                }
              />
              <Route path="/keywords" Component={Keywords} />
              <Route path="/favorite" element={<Favorite />}></Route>
              <Route path="/favorite/edit/:id" element={<FavoriteEdit />} />
              <Route path="/prompt/*" element={<Prompt />} />
              <Route path="/setting" Component={Setting} />
            </Routes>
          </PromptsProvider>
        </div>
      </UserProvider>
    </div>
  )
})
