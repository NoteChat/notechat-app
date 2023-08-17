import React, { useCallback, useContext, useEffect } from 'react'
import style from './style.module.scss'
import SplitPane from 'react-split-pane'
import { Textarea } from '@renderer/components/form'
import { EraserIcon, MagicWandIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ResponseText } from '@renderer/components/responseText'
import { ConfirmDialog } from '@renderer/components/dialog'
import { MySocket, PromptDto } from '@renderer/api'
import { VSCodeIcon } from '@renderer/components/icon'
import { Import } from '@renderer/components/import'
import { ChatContext } from '@renderer/context/chat'
import { PromptsContext } from '@renderer/context/prompts'

export type ChatMessageType = {
  role: 'user' | 'assistant' | 'system'
  content: string
  stopped?: boolean
  loading?: boolean
}

export interface ChatProps { }

export const Chat: React.FC<ChatProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { prompts } = useContext(PromptsContext)
  const { messages, setMessages, updateLastMessage, appendLastContent } = useContext(ChatContext)
  const socket = MySocket.getSocket()

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
        if (content) {
          sendMsg(content.value, () => {
            content.value = ''
          })
        }
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

  const sendMsg = (content, callback?: Function) => {
    if (messages.length > 0 && messages[messages.length - 1].loading) {
      toast.loading('正在努力加载中，请稍后再试！', { duration: 1000 })
      return
    }

    const uid = localStorage.getItem('uid')
    const nextMessages = [...messages]
    nextMessages.push({ role: 'user', content: content })
    if (socket) {
      if (!socket.active) {
        socket.connect()
      }
      socket.emit('chat', { userId: uid, messages: nextMessages.slice(-5) })
    }

    // Handle UI logic
    callback?.()
    nextMessages.push({ role: 'assistant', content: '', loading: true })
    setMessages(nextMessages)
    scrollToBottom()
  }

  const onClickNormalPrompt = () => {
    const content = document.querySelector<HTMLTextAreaElement>('#chatContent')
    if (content) {
      sendMsg(content)
    }
  }

  const onClickPrompt = (prompt: PromptDto) => {
    const content = document.querySelector<HTMLTextAreaElement>('#chatContent')
    if (content) {
      const finalContent = prompt.prompt.replace(/\$\{content\}/g, content.value)
      sendMsg(finalContent)
    }
  }

  const onClearHistory = () => {
    localStorage.removeItem('chatHistory')
    setMessages([])
  }

  const onStop = () => {
    appendLastContent({
      role: 'system',
      content: '\n\n Stopped chat.',
      loading: false,
      stopped: true
    })
    socket?.disconnect()
  }

  const handleChatRes = (res) => {
  
    if (res.code === 1000) {
      const chatRes = JSON.parse(res.data);

      if (chatRes.code === 'chat-list-too-long') {
        toast.error('聊天记录太长了，请清理一下聊天记录吧！')
        onStop()
      } else if (chatRes.success) {
        appendLastContent({
          content: chatRes.message,
          role: 'assistant',
          loading: chatRes.code !== 'finish'
        })
      }
    } else {
      updateLastMessage({
        role: 'system',
        content: res.data.message || 'Sorry, system error.'
      })
    }
  }

  const handleException = (res) => {
    if (res.message === 'Unauthorized access') {
      navigate('/login')
    }
  }

  useEffect(() => {
    if (socket) {
      console.log(1)
      if (socket.listeners('chat').length === 0) {
        socket.on('chat', handleChatRes)
        socket.on('exception', handleException)
      }
    }
    return () => {
      socket!.off('chat', handleChatRes);
      socket!.off('exception', handleChatRes);
    }
  }, [])

  useEffect(() => {
    
    document.getElementById('chatContent')?.focus()
    scrollToBottom({ behavior: 'auto' })
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
              toolbar={['quote'] as any}
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
              onStop={onStop}
            />
          </div>
        </div>
      )
    })
  }

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
                    <EraserIcon width={18} height={18} />
                  </button>
                }
              />
              {renderExtensions()}
              <Import
                onExtracted={(content) => {
                  const inputDom = document.querySelector<HTMLTextAreaElement>('#chatContent')
                  if (inputDom) {
                    inputDom.value = content
                  }
                }}
                className={style.chatImportBtn}
              />
            </div>
            <div className={style.chatInputWrapper}>
              <Textarea
                id="chatContent"
                onKeyUp={onEnterKeyUp}
                onKeyDown={onEnterKeyDown}
                placeholder={t('enterContent.placeholder')}
                tabIndex={1}
                maxLength={30000}
              ></Textarea>
              <button className={style.submitBtn} onClick={onClickNormalPrompt}>
                <PaperPlaneIcon tabIndex={2} />
              </button>
            </div>
          </div>
        </SplitPane>
      </div>
    </>
  )
}
