import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import * as Form from '@radix-ui/react-form'
import { Button, Input, Select } from '@renderer/components/form'
import style from './style.module.scss'
import Api, { UserDto, getDefaultHeader } from '@renderer/api'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from 'i18next'
import toast, { Toaster } from 'react-hot-toast'

export const Setting: React.FC = () => {
  const [user, setUser] = useState<any>({})
  const { t } = useTranslation()

  const onHandleEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userData = Object.fromEntries(new FormData(e.currentTarget)) as unknown as UserDto
    console.log('userData', userData)
    const uid = localStorage.getItem('uid')
    if (uid) {
      userData.id = Number(uid)
      Api.v1
        .updateProfile(userData, {
          headers: getDefaultHeader(),
          format: 'json'
        })
        .then((res) => {
          if (res.ok) {
            toast.success('Update Success')
          } else {
            toast.error('Update Failed')
          }
        })
    }
  }

  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    if (lang) {
      localStorage.setItem('lang', lang)
      changeLanguage(lang)
    }
  }

  useEffect(() => {
    const uid = localStorage.getItem('uid')
    if (!uid) {
      return
    }
    Api.v1
      .getProfile(
        { id: uid },
        {
          headers: getDefaultHeader(),
          format: 'json'
        }
      )
      .then((res: any) => {
        if (res.data) {
          setUser(res.data)
        }
      })
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
          <Form.Field className="FormField" name="aiEngine">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('aiEngine.label')}</Form.Label>
            </div>
            <Form.Control asChild>
              <Select defaultValue={user.aiEngine || 'gpt3.5-turbo'}>
                <option value="gpt3.5-turbo">ChatGPT-3.5-turbo</option>
                <option value="gpt4.0">ChatGPT-4.0</option>
              </Select>
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="language">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('language.label')}</Form.Label>
            </div>
            <Form.Control asChild>
              <Select onChange={onChangeLang} defaultValue={user.language || 'zh-cn'}>
                <option value="zh-cn">简体中文</option>
                <option value="en">English</option>
              </Select>
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <Button type="submit" style={{ marginTop: 10 }}>
              {t('update.button')}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
      <Toaster />
    </>
  )
}
