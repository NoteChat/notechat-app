import React from "react"

export type ChatMessageType = {
    role: 'user' | 'assistant' | 'system'
    content: string
    stopped?: boolean
    loading?: boolean
  }

export interface ChatContextProps {
    messages: ChatMessageType[]
    setMessages: (messages: ChatMessageType[]) => void
}

const initialContext: ChatContextProps = {
    messages: [],
    setMessages: () => {}
}

export function storeMessages(messages: ChatMessageType[]) {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function initialMessages() {
    const chatHistory = localStorage.getItem('chatHistory');
    let chatMessage:  ChatMessageType[] = [];
    if (chatHistory) {
        chatMessage = JSON.parse(chatHistory);
    }
    return chatMessage;
}


export const ChatContext = React.createContext<ChatContextProps>(initialContext);

export const ChatProvider: React.FC<React.PropsWithChildren> = (props) => {
    const [messages, setMessages] = React.useState<ChatMessageType[]>(initialMessages())

    const setMessagesWithStore = (messages: ChatMessageType[]) => {
        setMessages(messages);
        storeMessages(messages);
    }

    return (
        <ChatContext.Provider value={{ messages, setMessages: setMessagesWithStore }}>
            {props.children}
        </ChatContext.Provider>
    )
}
