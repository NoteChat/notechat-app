import React from 'react'
import { debounce } from 'lodash'
import { PromptDto } from '@renderer/api';

export type ChatMessageType = {
  role: 'user' | 'assistant' | 'system'
  content?: string;
  stopped?: boolean;
  code?: string;
  loading?: boolean
  aiEngine?: string;
  prompt?: PromptDto;
  originalContent?: string;
};

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

const storeKey = () => {
  const uid = localStorage.getItem('uid')
  return `chatHistory_${uid}`
}

export const storeMessages = debounce((messages: ChatMessageType[]) => {
  localStorage.setItem(storeKey(), JSON.stringify(messages))
}, 1000);

function initialMessages() {
  const chatHistory = localStorage.getItem(storeKey())
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
      storeMessages(newMessages)
      return newMessages
    })
  }

  const appendLastContent = (message: Partial<ChatMessageType>) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const lastIndex = newMessages.length - 1
      const prevMsg = newMessages[lastIndex]
      if (prevMsg.stopped) return prevMessages; // stop render when 
      newMessages[lastIndex] = { ...prevMsg, ...message, content: prevMsg.content + (message.content || '') }
      storeMessages(newMessages)
      return newMessages
    })
  }

  return (
    <ChatContext.Provider
      value={{ messages, setMessages: setMessagesWithStore, updateLastMessage, appendLastContent }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}
