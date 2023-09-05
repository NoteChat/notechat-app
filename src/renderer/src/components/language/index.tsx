import React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTranslation } from 'react-i18next'
import { changeUserLanguage } from '@renderer/context/user'
import { GlobeIcon } from '@radix-ui/react-icons'

export interface LanguageProps {
  showLabel?: boolean
}

export const ChangeLanguage: React.FC<LanguageProps> = ({ showLabel = false }) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <a className="cursor-pointer flex items-center gap-1" title={t('language.label')}>
          <GlobeIcon width={24} height={24} /> {showLabel ? t('language.label') : null}
        </a>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => changeUserLanguage('zh-cn')}
          >
            中文
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => changeUserLanguage('en')}>
            English
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export const LanguageLayout = ({ children }: React.PropsWithChildren<any>) => {
  return (
    <>
      {children}
      <div className="absolute right-100px top-20px">
        <ChangeLanguage showLabel />
      </div>
    </>
  )
}
