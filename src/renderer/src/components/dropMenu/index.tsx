import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons'
import style from './style.module.scss'
import classNames from 'classnames'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={classNames(className, style.DropdownMenuContent)}
          {...props}
          ref={forwardedRef}
        >
          {children}
          <DropdownMenuPrimitive.Arrow className={style.DropdownMenuArrow} />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    )
  }
)

export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuItem = DropdownMenuPrimitive.Item
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export const DropdownMenuCheckboxItem = React.forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        className={classNames(className, style.DropdownMenuCheckboxItem)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <DropdownMenuPrimitive.ItemIndicator className={style.DropdownMenuItemIndicator}>
          {props.checked === 'indeterminate' && <DividerHorizontalIcon />}
          {props.checked === true && <CheckIcon />}
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.CheckboxItem>
    )
  }
)

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuRadioItem = React.forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.RadioItem
        className={classNames(className, style.DropdownMenuRadioItem)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <DropdownMenuPrimitive.ItemIndicator className={style.DropdownMenuItemIndicator}>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.RadioItem>
    )
  }
)

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
