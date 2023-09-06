import React from 'react'
import classnames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { ChatIcon, ComponentIcon, GearIcon, VSCodeIcon } from '../icon'
import { useTranslation } from 'react-i18next'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import style from './style.module.scss'

import {
  ExitIcon,
  Pencil2Icon,
  PersonIcon,
  QuestionMarkCircledIcon,
  ReaderIcon,
  StarFilledIcon
} from '@radix-ui/react-icons'
import { ConfirmDialog } from '../dialog'
import { Textarea } from '../form'
import Api from '@renderer/api'
import { getCookie } from '@renderer/utils'
import toast from 'react-hot-toast'
import { ChangeLanguage } from '../language'

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
  const email = getCookie('username');

  const activeClass = (path: string) => {
    let isEq = false
    if (path === pathname) {
      isEq = true
    }
    if (path === '/chat' && pathname === '/') {
      isEq = true
    }

    if (pathname.includes('prompt') && path.includes('prompt')) {
      isEq = true
    }
    return isEq ? style.active : undefined
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('uid')
  }

  const onFeedback = async () => {
    const content = document.querySelector<HTMLTextAreaElement>('#feedback')?.value.trim();
    if (email) {
      if (!content) {
        toast.error('Please enter your feedback!');
        return;
      }
      const res = await Api.v1.feedback({
        email, 
        feedback: content
      })
      if (res.ok) {
        toast.success('Thanks for your feedback!');
      }
    }
  }

  return (
    <div className={classnames(style['sidebar'])}>
      <div className={style['sidebar-menu']}>
        <Link to="/chat">
          <MenuItem className={activeClass('/chat')} icon={<ChatIcon />}>
            {t('chat.label')}
          </MenuItem>
        </Link>
        <Link to="/editor">
          <MenuItem
            className={activeClass('/editor')}
            icon={<Pencil2Icon width={22} height={22} />}
          >
            {t('editor.label')}
          </MenuItem>
        </Link>
        <Link to="/favorite">
          <MenuItem
            className={activeClass('/favorite')}
            icon={<StarFilledIcon width={24} height={24} />}
          >
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
            <button className="cursor-pointer flex items-center" title={t('setting.label')}>
              <GearIcon />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <Link to="/setting" className="flex items-center gap-1 h-full w-full">
                  <PersonIcon /> {t('userSettings.label')}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="DropdownMenuItem">
                <Link className="flex items-center gap-1 h-full w-full" to={`https://billing.stripe.com/p/login/3cs7tQ1Hn3vy77O144?prefilled_email=${email}`} target="_blank">
                  <ReaderIcon />{t('billing.label')}
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="DropdownMenuSeparator" />

              <DropdownMenu.Item className="DropdownMenuItem">
                <Link onClick={onLogout} to="/login" className="flex items-center gap-1 h-full w-full" >
                  <ExitIcon /> {t('logout.label')}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Arrow className="DropdownMenuArrow" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <ChangeLanguage />
        <Link to="#" className="cursor-pointer flex items-center" title={t('helpDocs.label')}>
          <QuestionMarkCircledIcon width={24} height={24} />
        </Link>
        <ConfirmDialog
          title={t('feedback.label')}
          description={
              <Textarea placeholder={t('enterContent.placeholder')} id="feedback"className='w-full h-200px'/>
          }
          trigger={
              <Link
                to={`#`}
                className="cursor-pointer flex items-center"
                title={t('feedback.label')}
              >
                <VSCodeIcon icon="bug" style={{ fontSize: '24px' }} />
              </Link>
          }
          onConfirm={onFeedback}
        />
      </div>
    </div>
  )
}
