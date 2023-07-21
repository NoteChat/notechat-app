import React, { useCallback, useEffect } from 'react'
import style from './style.module.scss'
import SplitPane from 'react-split-pane'
import { Button, Textarea } from '@renderer/components/form'
import { EraserIcon, MagicWandIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Socket } from '@renderer/api'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { storeMessages } from '@renderer/app'
import { ResponseText } from '@renderer/components/responseText'
import { ConfirmDialog } from '@renderer/components/dialog'

export type ChatMessageType = {
  role: 'user' | 'assistant' | 'system'
  content: string
  loading?: boolean
}

export interface ChatProps {
  messages: ChatMessageType[]
  setMessages: (messages: ChatMessageType[]) => void
}

export const Chat: React.FC<ChatProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { messages, setMessages } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const keyMap = {}
  let timer

  const scrollToBottom = useCallback((options?: ScrollToOptions) => {
    const scrollAreaDom = document.getElementById('chatContentRoot')
    if (scrollAreaDom) {
      timer = setTimeout(() => {
        scrollAreaDom.scrollTo({
          left: 0,
          top: scrollAreaDom.scrollHeight,
          behavior: 'smooth',
          ...options
        })
      })
    }
  }, [])

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      const content = document.querySelector<HTMLTextAreaElement>('#chatContent')
      if (keyMap['Control'] && content) {
        content.value += '\n'
        keyMap['Control'] = false
      } else {
        sendMsg()
      }
      event.preventDefault()
    }
    if (event.key === 'Control') {
      keyMap['Control'] = true
    }
  }

  const onEnterKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Control') {
      keyMap['Control'] = false
    }
  }

  const sendMsg = () => {
    if (loading) {
      toast.loading('正在努力加载中，请稍后再试！', { duration: 1000 })
      return
    }

    setLoading(true)

    const uid = localStorage.getItem('uid')
    const chatInputDom = document.querySelector<HTMLTextAreaElement>('#chatContent')
    const content = chatInputDom?.value
    if (content) {
      messages.push({ role: 'user', content: content })
      Socket.emit('chat', { userId: uid, messages: [...messages] })

      // Handle UI logic
      chatInputDom.value = ''
      messages.push({ role: 'assistant', content: '', loading: true })
      storeMessages(messages)
      scrollToBottom()
    }
  }

  const onClearHistory = () => {
    localStorage.getItem('chatHistory')
    setMessages([])
  }

  useEffect(() => {
    document.getElementById('chatContent')?.focus()
    scrollToBottom({ behavior: 'auto' })

    Socket.on('chat', (res) => {
      setLoading(false)
      if (res.code === 1000 && res.data) {
        messages.pop()
        messages.push({ role: 'assistant', content: res.data.data })
      } else {
        messages.pop()
        messages.push({ role: 'system', content: 'Sorry, system error.' })
      }

      storeMessages(messages)
      scrollToBottom()
    })

    Socket.on('exception', (res) => {
      setLoading(false)
      if (res.message === 'Unauthorized access') {
        navigate('/login')
      }
    })

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const renderChatRecord = () => {
    return messages.map((msg, index) => {
      return msg.role === 'user' ? (
        <div key={index} className={classNames(style.chatContentItem, style.chatContentItemAsk)}>
          <div className={style.chatContentItemContent}>
            <ResponseText
              content={msg.content}
              loading={msg.loading}
              quoteTargetId="#chatContent"
              hideButton
            />
          </div>
          <div className={style.chatContentItemAvatar}>
            <span>Me</span>
          </div>
        </div>
      ) : (
        <div key={index} className={classNames(style.chatContentItem, style.chatContentItemRes)}>
          <div className={style.chatContentItemAvatar}>
            <span>GPT</span>
          </div>
          <div className={style.chatContentItemContent}>
            <ResponseText
              content={msg.content}
              loading={msg.loading}
              quoteTargetId="#chatContent"
            />
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className={style.chatPane}>
        <SplitPane split="horizontal" defaultSize="70%">
          <div id="chatContentRoot" className={style.chatContent}>
            {messages.length > 0 ? (
              <div id="chatContentWrapper" className={style.chatContentWrapper}>
                {renderChatRecord()}
              </div>
            ) : (
              <div className="h-full flex items-center font-600 justify-center gap-3">
                <MagicWandIcon /> 快点跟我聊天吧！ 例如：让我帮你写一首诗， 或者帮你整理一遍文稿！
              </div>
            )}
          </div>
          <div className={style.chatInput}>
            <div className={style.chatToolbar}>
              <ConfirmDialog
                title="确认"
                onConfirm={onClearHistory}
                description="确认清理当前的聊天记录吗？"
                trigger={
                <button title="清理聊天记录">
                  <EraserIcon width={18} height={18}/>
                </button>}
              />
            </div>
            <div className={style.chatInputWrapper}>
              <Textarea
                id="chatContent"
                onKeyUp={onEnterKeyUp}
                onKeyDown={onEnterKeyDown}
                placeholder={t('enterContent.placeholder')}
                tabIndex={1}
              ></Textarea>
              <div className={style.submitBtn} onClick={sendMsg}>
                <PaperPlaneIcon tabIndex={2} />
              </div>
            </div>
          </div>
        </SplitPane>
      </div>
      <Toaster />
    </>
  )
}
