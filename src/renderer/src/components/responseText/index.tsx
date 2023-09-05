import React, { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import cursorStyle from '@renderer/components/cursor/style.module.scss'
import toast from 'react-hot-toast'
import style from './style.module.scss'
import { QuoteIcon, StarFilledIcon, StopIcon } from '@radix-ui/react-icons'
import { ErrorBoundary } from '@renderer/errorBundary'
import API from '@renderer/api'
import * as Dialog from '@radix-ui/react-dialog'
import { DialogWindow } from '../dialog'
import { Button, Input } from '../form'
import { VSCodeIcon } from '../icon'
import hljs from 'highlight.js'
import classNames from 'classnames'

export interface ResponseTextProps extends React.ComponentProps<'div'> {
  content: string
  quoteTargetId: string
  loading?: boolean
  hideButton?: boolean
  toolbar?: ['quote', 'copy', 'favorite']
  onStop?: () => void
}

export const ResponseText: React.FC<ResponseTextProps> = (props) => {
  const {
    content,
    loading,
    quoteTargetId,
    hideButton,
    toolbar = ['quote', 'copy', 'favorite'],
    onStop
  } = props
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)

  const onQuote = (content) => {
    const chatInputDom = document.querySelector<HTMLTextAreaElement>(quoteTargetId)
    if (chatInputDom) {
      chatInputDom.value = content
      chatInputDom.focus()
    }
  }

  const onFavorite = async (event, content) => {
    const uid = localStorage.getItem('uid')
    const title = inputRef.current?.value.trim()
    const tags = tagsRef.current?.value.trim()
    if (!title) {
      toast.error('Title is required')
      event.preventDefault()
      return
    }
    const res = await API.v1.createFavorite({
      userId: Number(uid),
      title: title,
      tags: tags?.split(','),
      content: content
    })
    if (res.ok) {
      toast.success('Marked Success')
    }
  }

  const onCopy = (content) => {
    navigator.clipboard.writeText(content)
    toast.success('Copy Success')
  }

  const renderToolbarItem = (nodeItem: ReactNode, icon: string) => {
    return toolbar?.includes(icon as never) ? nodeItem : null
  }

  const Pre = ({ children }) => <pre className="relative">
    <VSCodeIcon icon="copy" onClick={() => onCopy(children[0].props.children[0])} className={style.copyCode} />
    {children}
  </pre>

  return (
    <div className={props.className}>
      <ErrorBoundary fallback={content}>
        <ReactMarkdown children={content}
          components={
            {
              pre: Pre,
              code({ node, inline, className, children, ...props }) {
                const content = hljs.highlightAuto(String(children).replace(/\n$/, '')).value
                return (
                  <code {...props} className={classNames('hljs', className)} dangerouslySetInnerHTML={
                    {
                      __html: content
                    }
                  }>
                  </code>
                )
              }
            }
          }
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
          {
            <DialogWindow
              trigger={renderToolbarItem(
                <button title={t('favorite.label')} id="id_trigger_fav">
                  <StarFilledIcon />
                </button>,
                'favorite'
              )}
              title={t('favorite.label')}
              description={
                <div>
                  <Input className="w-full" ref={inputRef} required placeholder="请输入收藏标题" />
                  <Input
                    className="w-full mt-4"
                    ref={tagsRef}
                    required
                    placeholder="请输入内容标签，多个标签使用 , 分隔"
                  />
                  <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                    <Dialog.Close asChild>
                      <Button
                        style={{ width: 120 }}
                        onClick={(event) => onFavorite(event, content)}
                      >
                        {t('confirm.label')}
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>
              }
            />
          }
        </div>
      ) : null}
    </div>
  )
}
