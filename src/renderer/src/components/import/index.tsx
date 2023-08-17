import React from 'react'
import { VSCodeIcon } from '../icon'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../dropMenu'
import dropDownStyle from '../dropMenu/style.module.scss'
import { DialogWindow } from '../dialog'
import { Button, Input } from '../form'
import { MySocket } from '@renderer/api'
import { toast } from 'react-hot-toast'
import classNames from 'classnames'
import { transformMdToHTML } from '@renderer/utils'
export interface ImportProps extends React.ComponentProps<'span'> {
  onExtracted?: (content: string) => void
}

export const MyImport: React.ForwardRefRenderFunction<HTMLSpanElement, ImportProps> = (
  props,
  ref
) => {
  const { t } = useTranslation()
  const { onExtracted, children, className, ...restProps } = props
  const refUrl = React.useRef<HTMLButtonElement>(null)
  const refFile = React.useRef<HTMLInputElement>(null)
  const [loading, setLoading] = React.useState(false)

  const onClickUrl = () => {
    if (refUrl.current) {
      refUrl.current.click()
    }
  }

  const onExtractContent = () => {
    const url = document.querySelector<HTMLInputElement>('#inputUrl')?.value
    if (url) {
      const Socket = MySocket.getSocket()
      if (!Socket) return
      toast.loading('Extracting...')
      Socket.emit('extract-text', { url: url })
      Socket.on('extract-text', function (res) {
        console.log('event', res)
        if (res.code === 1000) {
          onExtracted?.(res.data)
        }
        onClickUrl()
        toast.remove()
      })
    }
  }

  const onClickFile = () => {
    if (refFile.current) {
      refFile.current.value = ''
      refFile.current.click()
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    toast.loading(t('holdOn.button'))
    setLoading(true)
    if (file) {
      const reader = new FileReader()
      const fileName = file.name

      reader.onload = ((data: any) => {
        return async (e) => {
          let str = e.target?.result as string

          if (fileName.endsWith('.md')) {
            str = await transformMdToHTML(str)
          }
          onExtracted?.(str)
          toast.remove()
          setLoading(false)
        }
      })(file)
      reader.readAsText(file)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={classNames('cursor-pointer ml-1', className)}>
          <span ref={ref} title={t('import.label')} {...restProps}>
            <VSCodeIcon icon="new-folder" />
            {children}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className={dropDownStyle.DropdownMenuItem}
            onClick={onClickUrl}
            disabled={loading}
          >
            {t('extract.button')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={dropDownStyle.DropdownMenuItem}
            onClick={onClickFile}
            disabled={loading}
          >
            {t('importFromFile.label')}
          </DropdownMenuItem>
          {/* <DropdownMenuItem className={dropDownStyle.DropdownMenuItem}>
            {t('importFromImages.label')}
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogWindow
        trigger={<button style={{ visibility: 'hidden' }} ref={refUrl} className="" />}
        title={t('extract.button')}
        description={
          <>
            <Input
              className="flex-1 w-full"
              placeholder={t('extractFromURL.placeholder')}
              id="inputUrl"
              tabIndex={4}
            />
            <Button className="m-t right" onClick={onExtractContent}>
              {t('confirm.label')}
            </Button>
          </>
        }
      />
      <div>
        <Input
          type="file"
          ref={refFile}
          accept=".doc,.docx,.md,.txt"
          onChange={onFileChange}
          style={{ visibility: 'hidden' }}
          className="display-none"
        />
      </div>
    </>
  )
}

export const Import = React.forwardRef(MyImport)
