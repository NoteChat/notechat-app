import { CreateEditorDto, UpdateEditorDto } from '@renderer/api'
import React, { useEffect } from 'react'
import API from '@renderer/api'
import { useNavigate } from 'react-router-dom'

export interface EditorContextProps {
  editor: (CreateEditorDto & UpdateEditorDto) | undefined
  setEditor: (editor: CreateEditorDto & UpdateEditorDto) => void
}

const initialContext: EditorContextProps = {
  editor: undefined,
  setEditor: () => {}
}

export const EditorContext = React.createContext<EditorContextProps>(initialContext)

export const EditorProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [editor, setEditor] = React.useState<(CreateEditorDto & UpdateEditorDto) | undefined>()
  const navigate = useNavigate()
  const uid = localStorage.getItem('uid')

  const onLoadEditor = async () => {
    if (uid) {
      const res = await API.v1.findAllEditor({ userId: uid })
      if (res.data && res.data.length > 0) {
        setEditor({ ...res.data[0] })
      }
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    onLoadEditor()
  }, [])

  return (
    <EditorContext.Provider
      value={{
        editor,
        setEditor
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}
