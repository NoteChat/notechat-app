import React, { useCallback, useEffect, useState } from 'react'
import API, { PromptDto } from '@renderer/api'
import { useNavigate } from 'react-router-dom'

export interface PromptsContextProps {
  loadPrompts: (limit?: number) => void
  prompts: PromptDto[]
}

const initialContext: PromptsContextProps = {
  prompts: [],
  loadPrompts: () => {}
}

export const PromptsContext = React.createContext<PromptsContextProps>(initialContext)

export const PromptsProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [prompts, setPrompts] = useState<PromptDto[]>([])
  const navigate = useNavigate()

  const loadPrompts = useCallback(function (limit: number = 100) {
    const uid = localStorage.getItem('uid')
    if (uid) {
      API.v1
        .getPrompt({
          userId: Number(uid),
          limit
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
    <PromptsContext.Provider
      value={{
        prompts,
        loadPrompts
      }}
    >
      {props.children}
    </PromptsContext.Provider>
  )
}
