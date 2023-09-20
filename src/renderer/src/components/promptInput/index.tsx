import React from 'react'
import style from './style.module.scss'
import classNames from 'classnames'
import { Textarea } from '../form'
import { PaperPlaneIcon } from '@radix-ui/react-icons'

export interface PromptInputProps extends React.ComponentPropsWithoutRef<'div'> {
  onSubmitData?: (data: string) => void
  textAreaProps?: React.ComponentPropsWithoutRef<'textarea'>
}

const MyPromptInput: React.ForwardRefRenderFunction<HTMLDivElement, PromptInputProps> = (
  props,
  ref
) => {
  const { className, onSubmitData, textAreaProps, ...restProps } = props
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

  const sendMsg = () => {
    onSubmitData?.(textAreaRef.current?.value || '')
  }
  return (
    <div ref={ref} className={classNames(style.promptInputWrapper, className)} {...restProps}>
      <Textarea ref={textAreaRef} {...textAreaProps}></Textarea>
      <button className={style.submitBtn} onClick={sendMsg}>
        <PaperPlaneIcon tabIndex={2} />
      </button>
    </div>
  )
}

export const PromptInput = React.forwardRef(MyPromptInput)
