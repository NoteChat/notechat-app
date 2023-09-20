import React, { useCallback, useEffect, useState } from 'react'
import API, { PromptDto } from '@renderer/api'
import { useNavigate } from 'react-router-dom'
import { isArray } from 'lodash'

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

  const loadPrompts = useCallback(function (limit: number = 50) {
    const uid = localStorage.getItem('uid')
    if (uid) {
      API.v1
        .getPrompt({
          userId: Number(uid),
          limit
        })
        .then((res) => {
          if (res.ok) {
            if (res.data && isArray(res.data) && res.data.length > 0) {
              setPrompts(res.data as any)
            }
          }
        })
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
      loadPrompts()
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
