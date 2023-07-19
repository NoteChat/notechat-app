import React, { useEffect, useLayoutEffect, useRef } from 'react'
import API, { Socket } from '@renderer/api'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import style from './style.module.scss'
import { Button, Input } from '@renderer/components/form'
import SplitPane from 'react-split-pane'
import '@renderer/styles/SplitPane.scss'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'

export const Clone: React.FC<{}> = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<Quill>()
  const resultRef = useRef<Quill>()

  const { t } = useTranslation()

  const onSubmit = () => {
    if (!prompt || loading) return

    const promptContent = editorRef.current.getText()
    const inputPrompt = document.querySelector<HTMLInputElement>('#inputPrompt')?.value
    const uid = localStorage.getItem('uid')
  
    if (!promptContent || !inputPrompt) {
      toast.error(t('originalContent.check.required'))
    }

    setLoading(true)
    API.v1
      .autocomplete(// TODO, use Clone API
        {
          prompt: `## 指令 ## \n 根据指令要求，按用户给出的文本进行优化：\n 指令：${inputPrompt} \n 文本：\${content}`,
          content: promptContent,
          userId: Number(uid)
        })
      .then((res: any) => {
        if (res.data) {
          // setResult(res.data.data)
          resultRef.current.setText(res.data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  const onExtractContent = () => {
    const url = document.querySelector<HTMLInputElement>('#inputUrl')?.value;
    if (url) {
      Socket.emit('extract-text', { url: url });
      Socket.on('extract-text', function(res) {
        console.log('event', res);
        if (res.code === 1000) {
          editorRef.current.setText(res.data);
        }
      });
    }
  }

  const onCopy = () => {
    const result = resultRef.current.getText();
    if (result) {
      navigator.clipboard.writeText(result);
    }
  }

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) return

    const container = document.getElementById('PromptContent')
    if (!container) return
    const editor = new Quill(container, {
      module: {
        toolbar: '#toolbar'
      },
      placeholder: t('originalContent.placeholder'),
      theme: 'snow'
    })
    editor.focus();
    editorRef.current = editor
  }, [])

  useEffect(() => {
    if (resultRef.current) return

    const container = document.getElementById('PromptResult')
    if (!container) return
    const editor = new Quill(container, {
      placeholder: t('transformedContent.placeholder'),
      theme: 'snow'
    })
    resultRef.current = editor
  })

  return (
    <>
    
    <div className={style['textPane']}>
      <div className={style.docsContainer}>
        <SplitPane split="horizontal" defaultSize={'50%'}>
          <div className={style['textPane-input']}>
            <div className={style['textPane-editor']}>
              <div id="PromptContent" tabIndex={1} className='w-full h-full pb-10'></div>
            </div>
          </div>
          <div className={style['textPane-result']}>
            <div className={style.resultContent}>
              <div id="PromptResult" className='w-full h-full' tabIndex={2}></div>
            </div>
          </div>
        </SplitPane>
      </div>
      <div className={style.paneBottom}>
        <div className={style.bottomRow}>
          <Input
            className={style.inputUrl}
            placeholder={t('extractFromURL.placeholder')}
            id="inputUrl"
            tabIndex={4}
          />
          <Button tabIndex={4} onClick={onExtractContent} disabled={loading}>
            {loading ? t('extract.button') + '...' : t('extract.button')}
          </Button>
        </div>
        <div className={style.bottomRow}>
          <Input
            className={style.inputUrl}
            id="inputPrompt"
            placeholder={t('promptText.placeholder')}
            tabIndex={4}
          />
          <Button tabIndex={4} onClick={onSubmit} disabled={loading}>
            {loading ? t('holdOn.button') : t('perfect.button')}
          </Button>
          <Button tabIndex={4} onClick={onCopy} disabled={loading}>
            {t('copy.button')}
          </Button>
        </div>
      </div>
    </div>
    <Toaster />
    </>
  )
}
