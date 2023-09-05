import React from 'react'
import API from '@renderer/api'
import { debounce } from 'lodash'

export type ChatMessageType = {
  role: 'user' | 'assistant' | 'system'
  content: string
  stopped?: boolean
  code?: string;
  loading?: boolean
}

export interface ChatContextProps {
  messages: ChatMessageType[]
  setMessages: (messages: ChatMessageType[]) => void
  updateLastMessage: (message: Partial<ChatMessageType>) => void
  appendLastContent: (message: Partial<ChatMessageType>) => void
}

const initialContext: ChatContextProps = {
  messages: [],
  setMessages: () => { },
  updateLastMessage: () => { },
  appendLastContent: () => { }
}

export function storeMessages(messages: ChatMessageType[]) {
  localStorage.setItem('chatHistory', JSON.stringify(messages))
}

function initialMessages() {
  const chatHistory = localStorage.getItem('chatHistory')
  let chatMessage: ChatMessageType[] = []
  if (chatHistory) {
    chatMessage = JSON.parse(chatHistory)
  }
  return chatMessage
}

export const ChatContext = React.createContext<ChatContextProps>(initialContext)

export const ChatProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [messages, setMessages] = React.useState<ChatMessageType[]>(initialMessages())

  const setMessagesWithStore = (messages: ChatMessageType[]) => {
    setMessages(messages)
    storeMessages(messages)
  }

  const updateLastMessage = (message: Partial<ChatMessageType>) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastIndex = newMessages.length - 1
      newMessages[lastIndex] = { ...newMessages[lastIndex], ...message }
      storeMessages(messages)
      return newMessages
    })
  }

  const appendLastContent = (message: Partial<ChatMessageType>) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastIndex = newMessages.length - 1
      const prevMsg = newMessages[lastIndex]
      if (prevMsg.stopped) return prevMessages; // stop render when 
      newMessages[lastIndex] = { ...prevMsg, ...message, content: prevMsg.content + message.content }
      if (message.loading === false && message.code === 'finish') {
        countTokens(newMessages);
      }
      storeMessages(newMessages)
      return newMessages
    })
  }

  const countTokens = debounce((msgs) => {
    const last = msgs[msgs.length - 1];
    const before = msgs[msgs.length - 2];
    const uid = Number(localStorage.getItem('uid'));
    const completion = last.content;
    const prompt = before.content;
    API.v1.updateUserTokens({
      userId: uid,
      prompt: prompt, 
      completion: completion,
    });
  }, 500)

  return (
    <ChatContext.Provider
      value={{ messages, setMessages: setMessagesWithStore, updateLastMessage, appendLastContent }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}
