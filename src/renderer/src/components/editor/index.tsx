import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import API, { PromptDto, UpdateEditorDto } from '@renderer/api'
import 'quill/dist/quill.snow.css'
import style from './style.module.scss'
import SplitPane from 'react-split-pane'
import '@renderer/styles/SplitPane.scss'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'
import { ResponseText } from '@renderer/components/responseText'
import { PromptInput } from '@renderer/components/promptInput'
import { VSCodeIcon } from '@renderer/components/icon'
import { Import } from '@renderer/components/import'
import { PromptsContext } from '@renderer/context/prompts'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'

export interface EditorProps {
  value: UpdateEditorDto | undefined
  onChange?: (value: UpdateEditorDto) => void
}

const MyEditor: React.ForwardRefRenderFunction<EditorJS, EditorProps> = (props, ref) => {
  const { prompts } = useContext(PromptsContext)
  const [loading, setLoading] = React.useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<EditorJS>()
  const [result, setResult] = React.useState<string>('')
  // const { onChange, value } = props

  const { t } = useTranslation()

  const onSubmit = async (e) => {
    if (loading || e.key !== 'Enter') return
    e.preventDefault();

    const promptContent = editorRef.current?.save()
    const inputPrompt = document.querySelector<HTMLInputElement>('#inputPrompt')?.value

    if (!promptContent) {
      toast.error(t('originalContent.check.required'))
      return
    }

    const prompt = `## 指令 ## \n 根据指令要求，按用户给出的文本进行优化：\n 指令：${inputPrompt} \n 文本：\${content}`
    autocomplete(promptContent, prompt)
  }

  const autocomplete = (content, prompt) => {
    const uid = localStorage.getItem('uid')

    setLoading(true)
    API.v1
      .autocomplete({
        prompt,
        content,
        userId: Number(uid)
      })
      .then((res: any) => {
        if (res.data) {
          setResult(res.data.data)
        }
      })
      .finally(() => {
        setLoading(false)
       });
  }

  const onCopy = async () => {
    const editorText = await editorRef.current?.save();
    if (editorText) {
      navigator.clipboard.writeText(editorText.blocks[0].data.text)
    }
  }

  const onExtracted = (value: string) => {
    if (editorRef.current) {
      editorRef.current.render({ blocks: [{ type: 'paragraph', data: { text: value } }]  })
    }
  }

  const onClickPrompt = async (data: PromptDto) => {
    const editorText = await editorRef.current?.save();
    autocomplete(editorText, data.prompt)
  }

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {

    
    if (editorRef.current) {
      return;
    }
    const editor = new EditorJS({
      holder: 'PromptContent',
      // autofocus: true,
      placeholder: t('originalContent.placeholder'),
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3],
            defaultLevel: 2
          }
        },

      }
    })
    editorRef.current = editor
  }, [])

  const renderExtensions = () => {
    return prompts.map((prompt) => {
      return (
        <button key={prompt.id} onClick={() => onClickPrompt(prompt)} title={prompt.description}>
          {prompt.icon ? <VSCodeIcon icon={prompt.icon} /> : prompt.name.charAt(0)}
        </button>
      )
    })
  }

  return (
    <>
      <div className={style['textPane']}>
        <div className={style.docsContainer}>
          <SplitPane split="vertical" defaultSize={'70%'}>
            <div className={style['textPane-input']}>
              <div className={style['textPane-editor']}>
                <div id="PromptContent" tabIndex={1} className="w-full h-full pb-10"></div>
              </div>
            </div>
            <div className={style['textPane-result']}>
              <div className={style.extensionsBar}>
                {renderExtensions()}
                <div className={style.importButton}>
                  <Import 
                    onExtracted={onExtracted}
                  >
                    {t('import.label')}
                  </Import>
                </div>
              </div>
              <div className={style.paneBottom}>
                <PromptInput
                  textAreaProps={{
                    id: 'inputPrompt',
                    placeholder: '请输入指令',
                    onKeyDown: onSubmit
                  }}
                />
              </div>
              <div className={style.resultContent}>
                <div className={style.resultContentItem}>
                  <ResponseText content={result || t('noData')} quoteTargetId="inputPrompt" loading={loading} />
                </div>
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export const Editor = React.forwardRef(MyEditor)