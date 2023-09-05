import React, { useContext } from 'react'
import 'quill/dist/quill.snow.css'
import style from './style.module.scss'
import '@renderer/styles/SplitPane.scss'
import { Editor } from '@renderer/components/editor'
import API, { CreateEditorDto } from '@renderer/api'
import { EditorContext } from '@renderer/context/editor'
import { debounce } from 'lodash'
import { PackageAlert } from '@renderer/components/package'

export const GlobalEditor: React.FC<{}> = () => {
  const { editor, setEditor } = useContext(EditorContext)
  const uid = localStorage.getItem('uid')

  const onEditorChange = debounce(async (value: string) => {
    let res
    if (editor === undefined) {
      res = await API.v1.createEditor({ content: value, userId: Number(uid) } as CreateEditorDto)
    } else {
      const nextEditor = { ...editor, content: value, userId: Number(uid) }
      res = await API.v1.updateEditor(editor.id + '', nextEditor)
    }
    if (res.ok) {
      setEditor({ ...res.data })
    }
  }, 600)

  return (
    <>
      <div className={style.globalEditor}>
        <Editor key={editor?.id} value={editor} onChange={onEditorChange} />
        <PackageAlert />
      </div>
    </>
  )
}
