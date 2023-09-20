import React from 'react'
import * as RTooltip from '@radix-ui/react-tooltip'
import style from './style.module.scss'

export interface TooltipProps {
  trigger: React.ReactNode
  content: React.ReactNode
}

const MyTooltip: React.ForwardRefRenderFunction<HTMLDivElement, TooltipProps> = (props, ref) => {
  const { trigger, content } = props
  return (
    <RTooltip.Provider>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{trigger}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content className={style.TooltipContent} sideOffset={5}>
            <div ref={ref}>{content}</div>
            <RTooltip.Arrow className={style.TooltipArrow} />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}

export const Tooltip = React.forwardRef(MyTooltip)
