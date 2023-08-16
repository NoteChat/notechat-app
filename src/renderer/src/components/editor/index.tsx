import React, { useContext, useEffect, useRef } from 'react'
import API, { PromptDto, UpdateEditorDto } from '@renderer/api'
import style from './style.module.scss'
import SplitPane from 'react-split-pane'
import '@renderer/styles/SplitPane.scss'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { ResponseText } from '@renderer/components/responseText'
import { PromptInput } from '@renderer/components/promptInput'
import { VSCodeIcon } from '@renderer/components/icon'
import { Import } from '@renderer/components/import'
import { PromptsContext } from '@renderer/context/prompts'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { Counter } from './counter'
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import 'quill-paste-smart';
import MarkdownToolbar from 'quill-markdown-toolbar';

export interface EditorProps {
  value: UpdateEditorDto | undefined
  onChange?: (value: string) => void
}

hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'ruby', 'python']
});

Quill.register('modules/counter', Counter)
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
Quill.register('modules/markdown-toolbar', MarkdownToolbar);

const toolbarOptions = {

  container: [
    [{ header: [1, 2, 3, 4, false] }],

    ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }], // toggled buttons

    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],

    ['blockquote', 'code-block', 'image', 'link'],

    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript

    ['clean'], // remove formatting button
    ['markdown'], // Add this.
    ['copy'],
  ],

  handlers: { // Add this.
    'markdown': function () { }
  }
}

const MyEditor: React.ForwardRefRenderFunction<Quill, EditorProps> = (props, ref) => {
  const { prompts } = useContext(PromptsContext)
  const [loading, setLoading] = React.useState<boolean>(false)
  const editorRef = useRef<Quill>()
  const [result, setResult] = React.useState<string>('')
  const { onChange, value } = props

  const { t } = useTranslation()

  const onSubmit = async (e) => {
    if (loading) return

    const promptContent = editorRef.current?.getText();
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
      })
  }

  const onCopy = () => {
    const editorText = editorRef.current?.getText()
    if (editorText) {
      navigator.clipboard.writeText(editorText)
      toast.success(t('copySuccess'))
    }
  }

  const onExtracted = (value: string) => {
    if (value) {
      editorRef.current.clipboard.dangerouslyPasteHTML(value)
    }
  }

  const onClickPrompt = (data: PromptDto) => {
    const editorText = editorRef.current.getText()
    autocomplete(editorText, data.prompt)
  }

  const onEditorChange = (delta, oldDelta, source) => {
    onChange?.(JSON.stringify(editorRef.current.getContents()))
  }

  useEffect(() => {
    if (editorRef.current) return

    const container = document.getElementById('PromptContent')
    if (!container) return

    const editor = new Quill(container, {
      modules: {
        // syntax: {
        //   highlight: (text: string) => hljs.highlightAuto(text).value
        // },
        toolbar: toolbarOptions,
        counter: {
          container: '#counter',
          unit: 'word'
        },
        clipboard: {
          allowed: {
              tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
              attributes: ['href', 'rel', 'target', 'class']
          },
          keepSelection: true,
          substituteBlockElements: true,
          magicPasteLinks: true,
          hooks: {
              uponSanitizeElement(node, data, config) {
                  // console.log(node);
              },
          },
        },
        markdownShortcuts: {},
        'markdown-toolbar': true // Add this.
      },

      placeholder: t('originalContent.placeholder'),
      theme: 'snow'
    })
    if (value?.content) {
      editor.setContents(JSON.parse(value.content))
    }
    editor.on('text-change', onEditorChange)
    document.querySelector('.ql-copy')?.addEventListener('click', onCopy)
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
                <div
                  id="PromptContent"
                  tabIndex={1}
                  className="w-full h-full pb-10 overflow-auto"
                  style={{ fontSize: '14px' }}
                ></div>
                <div
                  id="counter"
                  className="absolute right-10px bottom-10px"
                  style={{ color: 'var(--blackA11)' }}
                ></div>
              </div>
            </div>
            <div className={style['textPane-result']}>
              <div className={style.extensionsBar}>
                {renderExtensions()}
                <div className={style.importButton}>
                  <Import onExtracted={onExtracted}>{t('import.label')}</Import>
                </div>
              </div>
              <div className={style.paneBottom}>
                <PromptInput
                  textAreaProps={{
                    id: 'inputPrompt',
                    placeholder: t('promptText.placeholder'),
                  }}
                  onSubmitData={onSubmit}
                />
              </div>
              <div className={style.resultContent}>
                <div className={style.resultContentItem}>
                  <ResponseText
                    content={result || t('noData')}
                    quoteTargetId="inputPrompt"
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
    </>
  )
}

export const Editor = React.forwardRef(MyEditor)
