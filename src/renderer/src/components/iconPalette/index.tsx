import React from 'react'
import style from './style.module.scss'
import Icons from '@vscode/codicons/src/template/mapping.json'
import classNames from 'classnames'

export interface IconPaletteProps {
  onClick: (icon: string) => void
}

export const IconPalette: React.FC<IconPaletteProps> = (props) => {

    const onClickIcon = (iconKey: string) => {
        props.onClick?.(iconKey)
    }

  const iconList = Object.keys(Icons).map((key) => {
    return (
      <button
        onClick={() => onClickIcon(key)}
        key={key}
        title={key}
        className={classNames('codicon', `codicon-${key}`)}
      />
    )
  })
  return <div className={style.iconPalette}>{iconList}</div>
}
