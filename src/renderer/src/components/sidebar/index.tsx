import React from 'react'
import classnames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { ChatIcon, ComponentIcon, GearIcon, TextIcon, VSCodeIcon } from '../icon'
import { useTranslation } from 'react-i18next'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import style from './style.module.scss'
import { ExitIcon, Pencil2Icon, PersonIcon, QuestionMarkCircledIcon, StarFilledIcon } from '@radix-ui/react-icons'

interface MenuItemProps extends React.ComponentProps<'div'> {
  icon?: React.ReactElement
}

const MyMenuItem: React.ForwardRefRenderFunction<HTMLDivElement, MenuItemProps> = (
  props: MenuItemProps,
  ref
) => {
  const { className, children, icon, ...restProps } = props
  return (
    <div ref={ref} className={classnames(className, style['sidebar-menu-item'])} {...restProps}>
      <div className={style['sidebar-menu-item-icon']}>{icon}</div>
      <div className={style['sidebar-menu-item-text']}>{children}</div>
    </div>
  )
}

const MenuItem = React.forwardRef(MyMenuItem)

export const Sidebar: React.FC<React.PropsWithChildren> = () => {
  const location = useLocation()
  const pathname = location.pathname
  const { t } = useTranslation()

  const activeClass = (path: string) => {
    let isEq = false;
    if (path === pathname) {
      isEq = true;
    }
    if (path === '/chat' && pathname === '/') {
      isEq = true;
    }

    if (pathname.includes('prompt') && path.includes('prompt')) {
      isEq = true;
    }
    return isEq ? style.active : undefined
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('uid')
  }

  return (
    <div className={classnames(`absolute left-0 top-0 bottom-0 m-auto`, style['sidebar'])}>
      <div className={style['sidebar-menu']}>
        <Link to="/chat">
          <MenuItem className={activeClass('/chat')} icon={<ChatIcon />}>
            {t('chat.label')}
          </MenuItem>
        </Link>
        <Link to="/editor">
          <MenuItem className={activeClass('/editor')} icon={<Pencil2Icon width={22} height={22} />}>
            {t('editor.label')}
          </MenuItem>
        </Link>
        <Link to="/keywords">
          <MenuItem className={activeClass('/keywords')} icon={<TextIcon />}>
            {t('keywords.label')}
          </MenuItem>
        </Link>
        <Link to="/favorite">
          <MenuItem className={activeClass('/favorite')} icon={<StarFilledIcon width={24} height={24}/>}>
            {t('favorite.label')}
          </MenuItem>
        </Link>
        <Link to="/prompt/edit">
          <MenuItem className={activeClass('/prompt/edit')} icon={<ComponentIcon />}>
            {t('prompt.label')}
          </MenuItem>
        </Link>
      </div>
      <div className={style['settings']}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
                <button className='cursor-pointer' title={t('setting.label')}><GearIcon /></button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <Link to="/setting">
                  <PersonIcon /> {t('userSettings.label')}
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="DropdownMenuSeparator" />

              <DropdownMenu.Item className="DropdownMenuItem">
                <Link onClick={onLogout} to="/login">
                  <ExitIcon /> {t('logout.label')}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Arrow className="DropdownMenuArrow" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
          <Link to="#" className='cursor-pointer' title={t('helpDocs.label')}  >
            <QuestionMarkCircledIcon width={24} height={24} />
          </Link>
          <Link to={`mailto:wewoor@gmail.com?subject=${t('feedback.label')}`} target='_blank' className='cursor-pointer' title={t('feedback.label')}  >
              <VSCodeIcon icon="bug" style={{fontSize: '24px'}}/>
          </Link>
      </div>
    </div>
  )
}
