import React from 'react'
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import cursorStyle from '@renderer/components/cursor/style.module.scss'
import 'highlight.js/styles/nnfx-dark.css'
import toast from 'react-hot-toast';
import style from './style.module.scss'
import { ClipboardCopyIcon, QuoteIcon } from '@radix-ui/react-icons';

export interface ResponseTextProps {
    content: string
    quoteTargetId: string
    loading?: boolean
    hideButton?: boolean
}

export const ResponseText: React.FC<ResponseTextProps> = (props) => {
    const { content, loading, quoteTargetId, hideButton } = props;
    const { t } = useTranslation()

    const onQuote = (content) => {
        const chatInputDom = document.querySelector<HTMLTextAreaElement>(quoteTargetId)
        if (chatInputDom) {
            chatInputDom.value = content
            chatInputDom.focus()
        }
    }
    
    const onCopy = (content) => {
        navigator.clipboard.writeText(content)
        toast.success('Copy Success')
    }

    return (
        <div>
            <ReactMarkdown children={content} rehypePlugins={[rehypeHighlight]} />
            {loading ? (
              <div>
                <span className={cursorStyle.inputCursorAnimation}>{t('typing.label')}</span>{' '}
              </div>
            ) : null}
            {content && !hideButton ? (
              <div className={style.contentButton}>
                <button onClick={() => onQuote(content)} title={t('quote.button')}>
                  <QuoteIcon />
                </button>
                <button onClick={() => onCopy(content)}  title={t('copy.button')}>
                  <ClipboardCopyIcon />
                </button>
              </div>
            ) : null}
        </div>
    )
}