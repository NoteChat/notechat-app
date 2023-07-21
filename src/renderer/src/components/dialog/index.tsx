import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

import style from './style.module.scss'
import { Button } from '../form'

export interface ConfirmProps {
    description: string;
    title: string;
    onClose?: () => void;
    onConfirm: () => void;
    trigger: React.ReactNode;
}

const Confirm: React.FC<ConfirmProps> = (props) => {
    const { description, title, onConfirm , trigger} = props;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        { trigger }
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={style.DialogOverlay} />
        <Dialog.Content className={style.DialogContent}>
          <Dialog.Title className={style.DialogTitle}>{title}</Dialog.Title>
          <Dialog.Description className={style.DialogDescription}>
            {description}
          </Dialog.Description>
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <Button style={{width: 120 }} onClick={onConfirm}>Confirm</Button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className={style.IconButton} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const ConfirmDialog = React.memo(Confirm)