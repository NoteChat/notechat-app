import React, { useContext, useEffect } from 'react'
import classNames from 'classnames'
import * as Form from '@radix-ui/react-form'
import { Button, Input } from '@renderer/components/form'
import style from './style.module.scss'
import { UserDto } from '@renderer/api'
import { useTranslation } from 'react-i18next'
import { UserContext } from '@renderer/context/user'
import dayjs from 'dayjs'
import { PackageAlert } from '@renderer/components/package'
import { Link } from 'react-router-dom'

export const Setting: React.FC = () => {
  const { user, updateProfile, loadProfile } = useContext(UserContext)
  const { t } = useTranslation()

  const onHandleEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userData = Object.fromEntries(new FormData(e.currentTarget)) as unknown as UserDto
    if (userData.notionApiKey?.includes('*')) {
      delete userData.notionApiKey
    }
    const uid = localStorage.getItem('uid')
    if (uid) {
      userData.id = Number(uid)
      updateProfile(userData)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <>
      <div className={classNames('w-full', style.setting)}>
        <h1 className={style.title}>{t('setting.title')}</h1>
        <Form.Root id="promptForm" onSubmit={onHandleEvent} method="POST">
          <Form.Field className="FormField" name="alias">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('username.label')}</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                {t('username.check.required')}
              </Form.Message>
              <Form.Message className="FormMessage" match="typeMismatch">
                {t('username.check.valid')}
              </Form.Message>
            </div>
            <Form.Control asChild>
              <Input type="text" defaultValue={user?.alias} required readOnly />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="email">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('email.label')}</Form.Label>
            </div>
            <Form.Control asChild>
              <Input defaultValue={user?.email} type="email" />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="notionApiKey">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">
                Notion API Key
                <small>
                  <Link className='color-blue' target='_blank' to="https://www.notion.so/my-integrations">（Get API Key?）</Link>
                </small>
              </Form.Label>
            </div>
            <Form.Control asChild>
                <Input defaultValue={user?.notionApiKey} type="text" />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="notionRootPageId">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">
                Notion Page ID
                <small>
                  <Link className='color-blue' target='_blank' to="https://developers.notion.com/docs/working-with-page-content">（Get Page ID?）</Link>
                </small>
              </Form.Label>
            </div>
            <Form.Control asChild>
                <Input defaultValue={user?.notionRootPageId} type="text" />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="package">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('package.label')}</Form.Label>
            </div>
            <Form.Control asChild>
              <div className="h-35px flex items-center  gap-2">
                <div className="flex  gap-2">
                  <span>{user?.package || 'None'}</span>
                  {user?.package && user?.paymentMode === 'payment' ? (
                    <span>
                      {t('expireDate.label')}: {dayjs(user.expiresAt).format('YYYY-MM-DD')}
                    </span>
                  ) : user?.package && user?.paymentMode === 'subscribe' ? (
                    user.subscribeInterval
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="countTokens">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('countTokens.label')}</Form.Label>
            </div>
            <Form.Control asChild>
              <div className="flex gap-2">
                <p>
                  {t('promptTokens.label')}: <span color='orange'>{user?.promptTokens}</span>
                </p>
                <p>
                  {t('completionTokens.label')}:  <span color='orange'>{user?.completionTokens}</span>
                </p>
              </div>
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <Button type="submit" style={{ marginTop: 10 }}>
              {t('update.button')}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
      <PackageAlert />
    </>
  )
}
