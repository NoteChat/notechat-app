import React, { useEffect, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import style from './style.module.scss'
import '@renderer/styles/SplitPane.scss'
import { Editor } from '@renderer/components/editor'
import { PromptsProvider } from '@renderer/context/prompts'
import API, { CreateEditorDto, MySocket, UpdateEditorDto } from '@renderer/api'
import { useNavigate } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'

export const GlobalEditor: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS>()
  const [editor, setEditor] = useState<UpdateEditorDto | undefined>()
  const uid = localStorage.getItem('uid')

  const onLoadEditor = async () => {

    if (uid) {
      const res = await API.v1.findAllEditor({userId: uid})
       if (res.data && res.data.length > 0) {
        setEditor({...res.data[0]});
       }
    } else {
      navigate('/login') 
    }
  }

  const onEditorChange = async (value: UpdateEditorDto) => {
    if (editor === undefined) {
      const res = await API.v1.createEditor({...value, userId: Number(uid)} as CreateEditorDto)
      if (res.data) {
        setEditor({...res.data})
      }
    } else {
      const nextEditor = {...editor, ...value, userId: Number(uid) }
      MySocket.getSocket()?.emit('updateEditor', { editor: nextEditor})
    }
    console.log('updateEditor', {value})
  }

  useEffect(() => {
    onLoadEditor()
    MySocket.getSocket()?.on('updateEditor', (res) => {
      console.log('updateEditor', res)
    })
  }, [])

  return (
    <>
      <div className={style.globalEditor}>
        <PromptsProvider>
          <Editor value={editor} onChange={onEditorChange}/>
        </PromptsProvider>
      </div>
    </>
  )
}
