import React, { ReactNode } from 'react'
import * as RCheckbox from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'
import style from './style.module.scss'

export interface CheckboxProps {
  id: string | undefined
  onChange?: (checked: boolean) => void
  label?: ReactNode
  checked?: boolean
}

const MyCheckbox: React.ForwardRefRenderFunction<HTMLDivElement, CheckboxProps> = (props, ref) => {
  const { id, label, checked, onChange, ...restProps } = props

  return (
    <div className={style.CheckboxWrapper} ref={ref}>
      <RCheckbox.Root
        defaultChecked={checked}
        checked={checked}
        className={style.CheckboxRoot}
        id={id}
        onCheckedChange={onChange}
        {...restProps}
      >
        <RCheckbox.Indicator className={style.CheckboxIndicator}>
          <CheckIcon />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      {label ? (
        <label className={style.Label} htmlFor={id}>
          {label}
        </label>
      ) : null}
    </div>
  )
}

export const Checkbox = React.forwardRef(MyCheckbox)
