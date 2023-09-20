import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import cursorStyle from '@renderer/components/cursor/style.module.scss'
import toast from 'react-hot-toast'
import style from './style.module.scss'
import { NotionLogoIcon, QuoteIcon, StopIcon } from '@radix-ui/react-icons'
import { ErrorBoundary } from '@renderer/errorBundary'
import API from '@renderer/api'
import { VSCodeIcon } from '../icon'
import hljs from 'highlight.js'
import classNames from 'classnames'
import { StarText } from '../starText'
import { markdownToBlocks } from '@tryfabric/martian'

export interface ResponseTextProps extends React.ComponentProps<'div'> {
  title?: string
  content: string
  quoteTargetId: string
  loading?: boolean
  hideButton?: boolean
  toolbar?: ['quote', 'copy', 'favorite', 'notion']
  extraToolbar?: ReactNode
  onStop?: () => void
}

export const ResponseText: React.FC<ResponseTextProps> = (props) => {
  const {
    title,
    content,
    loading,
    quoteTargetId,
    hideButton,
    toolbar = ['quote', 'copy', 'favorite', 'notion'],
    extraToolbar,
    onStop
  } = props
  const { t } = useTranslation()
  const [saving, setSaving] = React.useState(false)

  const onQuote = (content) => {
    const chatInputDom = document.querySelector<HTMLTextAreaElement>(quoteTargetId)
    if (chatInputDom) {
      chatInputDom.value = content
      chatInputDom.focus()
    }
  }

  const onSaveToNotion = async (content) => {
    if (content) {
      setSaving(true)
      const tt = title ? title : content.split('\n')[0]
      const c: any = markdownToBlocks(content, {
        notionLimits: {
          truncate: false
        }
      })
      const res = await API.v1.createPage({
        title: tt,
        content: c
      })
      if (res.data.code === 1000) {
        toast.success('Save to Notion success!')
      } else if (res.data.code === 1011) {
        toast.error(t('notion.unset.error'))
      } else {
        toast.error('Save to Notion failed!' + res.data.message)
      }
      setSaving(false)
    }
  }

  const onCopy = (content) => {
    navigator.clipboard.writeText(content)
    toast.success('Copy Success')
  }

  const renderToolbarItem = (nodeItem: ReactNode, icon: string) => {
    return toolbar?.includes(icon as never) ? nodeItem : null
  }

  const Pre = ({ children }) => (
    <pre className="relative">
      <VSCodeIcon
        icon="copy"
        onClick={() => onCopy(children[0].props.children[0])}
        className={style.copyCode}
      />
      {children}
    </pre>
  )

  return (
    <div className={props.className}>
      <ErrorBoundary fallback={content}>
          <ReactMarkdown
            children={content}
            components={{
              pre: Pre,
              code({ node, inline, className, children, ...props }) {
                const content = hljs.highlightAuto(String(children).replace(/\n$/, '')).value
                return (
                  <code
                    {...props}
                    className={classNames('hljs', className)}
                    dangerouslySetInnerHTML={{
                      __html: content
                    }}
                  ></code>
                )
              }
            }}
          />
      </ErrorBoundary>
      {loading ? (
        <span className="flex items-center">
          <span className={cursorStyle.inputCursorAnimation}>{t('typing.label')}</span>{' '}
          <button className={style.stopButton} title={t('stop.label')} onClick={onStop}>
            <StopIcon /> {t('stop.label')}
          </button>
        </span>
      ) : null}
      {content && !hideButton ? (
        <div className={style.contentButton}>
          {renderToolbarItem(
            <button onClick={() => onQuote(content)} title={t('quote.button')}>
              <QuoteIcon />
            </button>,
            'quote'
          )}
          {renderToolbarItem(
            <button onClick={() => onCopy(content)} title={t('copy.button')}>
              <VSCodeIcon icon="copy" />
            </button>,
            'copy'
          )}
          {renderToolbarItem(<StarText content={content} />, 'favorite')}
          {renderToolbarItem(
            <button
              title={t('saveToNotion.label')}
              onClick={() => onSaveToNotion(content)}
              disabled={saving}
            >
              <NotionLogoIcon />
            </button>,
            'notion'
          )}
          {extraToolbar}
        </div>
      ) : null}
    </div>
  )
}
