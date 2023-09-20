import React, { useCallback, useContext, useEffect, useState } from 'react'
import style from './style.module.scss'
import { Select, Textarea } from '@renderer/components/form'
import { EraserIcon, MagicWandIcon, PaperPlaneIcon, StopIcon } from '@radix-ui/react-icons'
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
import { PackageAlert } from '@renderer/components/package'
import { UserContext } from '@renderer/context/user'
import { AI_ENGINES, getAIEngine } from '@renderer/consts'
import SplitPane, { Pane } from 'split-pane-react'
import 'split-pane-react/esm/themes/default.css'

export interface ChatProps {}

type SendMsgType = {
  content: string;
  prompt?: PromptDto
  callback?: Function
}

export const Chat: React.FC<ChatProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { prompts } = useContext(PromptsContext)
  const { user, updateProfile, shouldCharge } = useContext(UserContext)
  const { messages, setMessages, updateLastMessage, appendLastContent } = useContext(ChatContext)
  const socket = MySocket.getSocket()

  const [sizes, setSizes] = useState(['70%', '30%', 'auto'])

  const keyMap = {}
  let timer
  const uid = localStorage.getItem('uid')

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
          sendMsg({
            content: content.value, 
            callback: () => {
              content.value = ''
            }
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

  const sendMsg = (msg: SendMsgType) => {
    const { content, callback, prompt } = msg
    if (messages.length > 0 && messages[messages.length - 1].loading) {
      toast.loading(t('loading.label'), { duration: 1000 })
      return
    }

    if (shouldCharge()) {
      toast.error(t('packageExpired.error'))
      return
    }

    const nextMessages = [...messages]
    const userContent = prompt ? compilePrompt(prompt.prompt, content) : content
    nextMessages.push({ role: 'user', content: userContent, prompt, originalContent: content })
    if (socket) {
      if (!socket.active) {
        socket.connect()
      }
      socket.emit('chat', {
        userId: uid,
        messages: nextMessages.slice(-5),
        aiEngine: sessionStorage.getItem('aiEngine')
      })
    }

    // Handle UI logic
    callback?.()
    nextMessages.push({ role: 'assistant', aiEngine: user?.aiEngine, loading: true, content: '' })
    setMessages(nextMessages)
    scrollToBottom()
  }

  const onClickNormalPrompt = () => {
    const contentEle = document.querySelector<HTMLTextAreaElement>('#chatContent')
    if (contentEle) {
      sendMsg({ content: contentEle.value })
      contentEle.value = ''
    }
  }

  const onClickPrompt = (prompt: PromptDto) => {
    const content = document.querySelector<HTMLTextAreaElement>('#chatContent')
    if (content && content.value) {
      sendMsg({ content: content.value, prompt })
    }
  }

  const compilePrompt = (prompt: string, content) => {
    return prompt.replace(/\$\{content\}/g, content)
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

  const onAiEngineChange = (e) => {
    const engine = e.target.value
    if (engine) {
      updateProfile(
        {
          id: Number(user?.id),
          aiEngine: engine
        },
        true
      )
    }
  }

  const handleChatRes = (res) => {
    if (res.code === 1000) {
      appendLastContent({
        content: res.data,
        role: 'assistant',
        loading: true
      })
    } else if (res.code === 2000) {
      // socket end
      appendLastContent({
        role: 'assistant',
        loading: false,
        stopped: true,
      })
    } else {
      updateLastMessage({
        role: 'system',
        loading: false,
        stopped: true,
        content: res.message || res.data.message || 'Sorry, system error.'
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
        socket.on('close', () => {
          onStop()
        })
      }
    }
    return () => {
      if (socket) {
        socket.off('chat', handleChatRes)
        socket.off('exception', handleException)
      }
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
            {
              msg.prompt ? <div>
                <section className='flex items-center justify-end gap-1'>
                  <VSCodeIcon icon={msg.prompt.icon} />
                  {msg.prompt.name}
                </section>
                <ResponseText
                  content={msg.originalContent || ''}
                  loading={msg.loading}
                  quoteTargetId="#chatContent"
                  toolbar={['quote'] as any}
                />
              </div> : 
              <ResponseText
                content={msg.content || ''}
                loading={msg.loading}
                quoteTargetId="#chatContent"
                toolbar={['quote'] as any}
              />
            }
          </div>
          <div className={style.chatContentItemAvatar}>
            <span>Me</span>
          </div>
        </div>
      ) : (
        <div key={index} className={classNames(style.chatContentItem, style.chatContentItemRes)}>
          <div
            className={style.chatContentItemAvatar}
            style={{
              backgroundColor: msg.aiEngine?.includes('gpt-4')
                ? 'var(--green12)'
                : 'var(--second-color)'
            }}
          >
            <span>{user?.chatbotName || 'GPT'}</span>
          </div>
          <div className={style.chatContentItemContent}>
            <span className={style.chatContentItemAi}>{msg.aiEngine ? getAIEngine(msg.aiEngine)?.label : 'GPT'}</span>
            <ResponseText
              content={msg.content || ''}
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
    return prompts && prompts.map((prompt) => {
      return (
        <button key={prompt.id} onClick={() => onClickPrompt(prompt)} title={prompt.description}>
          {prompt.icon ? <VSCodeIcon icon={prompt.icon} /> : prompt.name.charAt(0)}
        </button>
      )
    })
  }

  const renderAiEngine = () => {
    return (
      <Select className={style.engineSelector} onChange={onAiEngineChange} value={user?.aiEngine}>
        {AI_ENGINES.map((engine) => (
          <option key={engine.id} value={engine.value}>
            {engine.label}
          </option>
        ))}
      </Select>
    )
  }

  return (
    <>
      <div className={style.chatPane}>
        {/* @ts-ignore */}
        <SplitPane split="horizontal" sizes={sizes} onChange={setSizes}>
          <Pane minSize={'10%'} maxSize="80%" >
            <div id="chatContentRoot" className={style.chatContent}>
              {messages.length > 0 ? (
                <div id="chatContentWrapper" className={style.chatContentWrapper}>
                  {renderChatRecord()}
                </div>
              ) : (
                <div className="h-full flex items-center font-600 justify-center gap-3">
                  <MagicWandIcon /> {t('chatPromptIntro.label')}
                </div>
              )}
            </div>
          </Pane>
          <Pane minSize={'10%'} maxSize="80%" className={style.borderTop}>
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
                  placeholder={t('chatInput.placeholder')}
                  tabIndex={1}
                  maxLength={30000}
                ></Textarea>
                {renderAiEngine()}
                <button className={style.submitBtn} onClick={onClickNormalPrompt}>
                  <PaperPlaneIcon tabIndex={2} />
                </button>
              </div>
            </div>
          </Pane>
        </SplitPane>
        <PackageAlert />
      </div>
    </>
  )
}
