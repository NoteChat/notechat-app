import React from 'react'
import { VSCodeIcon } from '../icon'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropMenu'
import dropDownStyle from '../dropMenu/style.module.scss'

export const Import: React.FC<{}> = () => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <div>
                <button title={t('import.label')} className="cursor-pointer ml-1 color-blue">
                    <VSCodeIcon icon="symbol-reference" />
                </button>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem className={dropDownStyle.DropdownMenuItem}>Item</DropdownMenuItem>
        <DropdownMenuItem className={dropDownStyle.DropdownMenuItem}>Item</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
