import React from 'react'
import { Sidebar } from './components/sidebar'
import { Route, Routes } from 'react-router-dom'
import { Chat } from './pages/chat'
import { Text } from './pages/text'
import { Clone } from './pages/clone'
import Prompt from './pages/prompt'
import style from './style.module.css'
import { Setting } from './pages/setting'

export const App: React.FC<React.PropsWithChildren> = () => {
    return (
        <div className="w-full h-full">
            <Sidebar />
            <div className={style['main']}>
                <Routes>
                    <Route index path="/" Component={Chat} />
                    <Route path="/chat" Component={Chat} />
                    <Route path="/clone" index Component={Clone} />
                    <Route path="/text" Component={Text} />
                    <Route path="/prompt/*" Component={Prompt} />
                    <Route path="/setting" Component={Setting} />
                </Routes>
            </div>
        </div>
    )
}