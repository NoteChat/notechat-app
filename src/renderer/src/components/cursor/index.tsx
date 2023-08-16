import React from 'react'
import style from './style.module.scss'
import classNames from 'classnames'

export const InputCursor: React.FC<{}> = () => {
  return <span className={classNames(style.inputCursor, style.inputCursorAnimation)}></span>
}
