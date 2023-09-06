import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { StarFilledIcon } from '@radix-ui/react-icons'
import API from '@renderer/api'
import * as Dialog from '@radix-ui/react-dialog'
import { DialogWindow } from '../dialog'
import { Button, Input } from '../form'
import classNames from 'classnames'

export interface StarText extends React.ComponentProps<'div'> {
    getContent?: () => string
    content?: string
}

export const StarText: React.FC<StarText> = (props) => {
  const { content, getContent, className } = props
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)

  const onFavorite = async (event) => {
    const uid = localStorage.getItem('uid')
    const title = inputRef.current?.value.trim()
    const tags = tagsRef.current?.value.trim()
    let finalContent = content;
    if (!content && getContent) {
        finalContent = getContent();
    }
    
    if (!finalContent) {
        toast.error('Content is required')
        event.preventDefault()
        return
    }
    
    if (!title) {
      toast.error('Title is required')
      event.preventDefault()
      return
    }
    const res = await API.v1.createFavorite({
      userId: Number(uid),
      title: title,
      tags: tags?.split(','),
      content: finalContent
    })
    if (res.ok) {
      toast.success('Marked Success')
    }
  }

  return (
    <DialogWindow
      trigger={
        <button className={classNames(className)} title={t('favorite.label')}>
          <StarFilledIcon />
        </button>
      }
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
              <Button style={{ width: 120 }} onClick={onFavorite}>
                {t('confirm.label')}
              </Button>
            </Dialog.Close>
          </div>
        </div>
      }
    />
  )
}
