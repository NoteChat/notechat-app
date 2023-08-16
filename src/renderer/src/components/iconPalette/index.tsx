import React from 'react'
import style from './style.module.scss'
import Icons from '@vscode/codicons/src/template/mapping.json'
import classNames from 'classnames'
import { Input } from '../form'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
export interface IconPaletteProps {
  onClick: (icon: string) => void
}

const originIcons = Object.keys(Icons)

export const IconPalette: React.FC<IconPaletteProps> = (props) => {
  const [icons, setIcons] = React.useState<string[]>(originIcons)
  const { t } = useTranslation()

  const onFilter = () => {
    const inputDom = document.querySelector<HTMLInputElement>('#searchInput')
    if (!inputDom) return
    const value = inputDom.value.trim()
    if (!value) {
      setIcons(originIcons)
      return
    }
    const filterIcons = originIcons.filter((icon) => {
      return icon.includes(value)
    })
    setIcons(filterIcons)
  }

  const onClickIcon = (iconKey: string) => {
    props.onClick?.(iconKey)
  }

  const iconList = icons.map((key) => {
    return (
      <button
        onClick={() => onClickIcon(key)}
        key={key}
        title={key}
        className={classNames('codicon', `codicon-${key}`)}
      />
    )
  })

  return (
    <div className={style.iconPaletteWrapper}>
      <Input
        className="w-full mb-2"
        id="searchInput"
        placeholder={t('search.label')}
        onChange={debounce(onFilter, 200)}
      />
      <div className={style.iconPalette}>{iconList}</div>
    </div>
  )
}
