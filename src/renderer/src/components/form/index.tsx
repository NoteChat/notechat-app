import React from 'react'
import style from './style.module.scss'
import classNames from 'classnames'

const MyButton: React.ForwardRefRenderFunction<HTMLButtonElement, React.ComponentProps<'button'>> = ({ children, className, ...restProps }, ref) => {
    return (
        <button
        ref={ref}
        className={classNames(style.button, className)}
        {...restProps}
      >
        {children}
      </button>
    )
}

export const Button = React.forwardRef(MyButton);

export const MySelect: React.ForwardRefRenderFunction<HTMLSelectElement, React.ComponentProps<'select'>> = ({ children, className, ...restProps }, ref) => {
    return (
        <select
        ref={ref}
        className={classNames(style.select, className)}
        {...restProps}
      >
        {children}
      </select>
    )
}

export const Select = React.forwardRef(MySelect);


export const MyInput: React.ForwardRefRenderFunction<HTMLInputElement, React.ComponentProps<'input'>> = ({ children, className, ...restProps }, ref) => {
  return (
      <input
      ref={ref}
      className={classNames(style.input, className)}
      {...restProps}
    >
      {children}
    </input>
  )
}
export const Input = React.forwardRef(MyInput);


export const MyTextarea: React.ForwardRefRenderFunction<HTMLTextAreaElement, React.ComponentProps<'textarea'>> = ({ children, className, ...restProps }, ref) => {
  return (
      <textarea
      ref={ref}
      {...restProps}
      className={classNames(style.textarea, className)}
    >
      {children}
    </textarea>
  )
}

export const Textarea = React.forwardRef(MyTextarea);
