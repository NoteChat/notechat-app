import React, { useEffect, useRef } from 'react'
import { UpdateEditorDto } from '@renderer/api'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { VSCodeIcon } from '@renderer/components/icon'
import { Import } from '@renderer/components/import'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { Counter } from './counter'
import MarkdownShortcuts from 'quill-markdown-shortcuts'
import 'quill-paste-smart'
import MarkdownToolbar from 'quill-markdown-toolbar'
import AIComplete from './ai-complete'
import { DownloadIcon } from '@radix-ui/react-icons'
import { downloadMarkdown } from '@renderer/utils'
import { StarText } from '../starText'

export interface EditorProps {
  value: UpdateEditorDto | undefined
  onChange?: (value: string) => void
}

hljs.configure({
  // optionally configure hljs
  languages: ['javascript', 'ruby', 'python']
})

Quill.register('modules/markdownShortcuts', MarkdownShortcuts)
Quill.register('modules/markdown-toolbar', MarkdownToolbar)
Quill.register('modules/counter', Counter)
Quill.register('modules/aiComplete', AIComplete)

const toolbarOptions = {
  container: [
    [{ header: [1, 2, 3, 4, false] }],

    ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }], // toggled buttons

    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],

    ['blockquote', 'code-block', 'image', 'link'],

    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript

    ['clean'], // remove formatting button
    ['markdown'] // Add this.
  ],

  handlers: {
    // Add this.
    markdown: function () {}
  }
}

export const Editor: React.ForwardRefRenderFunction<Quill, EditorProps> = (props) => {
  const editorRef = useRef<Quill>()
  const { onChange, value } = props

  const { t } = useTranslation()

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

  const onEditorChange = () => {
    onChange?.(JSON.stringify(editorRef.current.getContents()))
  }

  const onExportMD = () => {
    const content = editorRef.current?.getText()
    const title = content.split('\n')[0];
    downloadMarkdown(title, content);
  }

  useEffect(() => {
    if (editorRef.current) return

    const container = document.getElementById('PromptContent')
    if (!container) return

    const editor = new Quill(container, {
      modules: {
        syntax: {
          highlight: (text: string) => hljs.highlightAuto(text).value
        },
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
          hooks: {}
        },
        markdownShortcuts: {},
        'markdown-toolbar': true, // Add this.
        aiComplete: true
      },

      placeholder: t('originalContent.placeholder'),
      theme: 'snow'
    })
    if (value?.content) {
      editor.setContents(JSON.parse(value.content))
    }
    editor.on('text-change', onEditorChange)
    editorRef.current = editor
  }, [])

  return (
    <>
      <div className={style['textPane']}>
        <div className={style.docsContainer}>
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
          <div className={style.extensionsBar}>
            <StarText getContent={() => { return editorRef.current?.getText() }} />
            <button title={t('download.label')}>
              <DownloadIcon onClick={onExportMD} />
            </button>
            <button onClick={onCopy} title={t('copy.button')}>
              <VSCodeIcon icon="copy" />
            </button>
            <Import onExtracted={onExtracted}></Import>
          </div>
        </div>
      </div>
    </>
  )
}
