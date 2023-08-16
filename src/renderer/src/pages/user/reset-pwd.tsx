import React, { useCallback, useState } from 'react'
import * as Form from '@radix-ui/react-form'
import API from '@renderer/api'
import { Link, useNavigate } from 'react-router-dom'
import md5 from 'js-md5'
import { Button, Input } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import logo from '@renderer/assets/128@2x.png'
import { getUrlParam } from '@renderer/utils'

const ResetPwd: React.FC<{}> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const code = getUrlParam('code');
  const email = getUrlParam('email');

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return;

    setLoading(true)

    const user = Object.fromEntries(new FormData(e.currentTarget))
    if (user.password !== user.confirmPassword) {
      toast.error('The passwords entered twice are inconsistent!')
      setLoading(false)
      return
    }
    user.password = md5(user.password)
    API.v1
      .resetPassword({
        email: user.email,
        password: user.password,
        validCode: code
      })
      .then((res: any) => {
        const { data } = res
        
        if (data.code !== 1000) {
          if (data.code === 1002) {
            toast.error(t('linkExpired.error'))
            navigate('/find-pwd')
          } else {
            toast.error(data.message)
          }
        } else {
          toast.success(t('resetPwd.success'))
          navigate('/login')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <div className="centerBlock" style={{ top: '40%' }}>
        <div className="text-center mb-10">
          <img src={logo} width={128} height={128} style={{ borderRadius: '10px' }} />
        </div>
        <h1 className="font-500 text-center">{t('resetPwd.label')}</h1>
        <Form.Root className="FormRoot m-auto mt-5" onSubmit={onSubmit} method="POST">
          <Form.Field className="FormField" name="email">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('email.label')}</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                {t('email.check.required')}
              </Form.Message>
              <Form.Message className="FormMessage" match="typeMismatch">
                {t('email.check.valid')}
              </Form.Message>
            </div>
            <Form.Control asChild>
              <Input type="email" required value={email || ''} readOnly/>
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="password">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('password.label')}</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                {t('password.check.required')}
              </Form.Message>
              <Form.Message className="FormMessage" match="tooShort">
                {t('password.check.validLen')}
              </Form.Message>
            </div>
            <Form.Control asChild>
              <Input type="password" minLength={6} max={128} required />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="confirmPassword">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('passwordConfirm.label')}</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                {t('password.check.required')}
              </Form.Message>
            </div>
            <Form.Control asChild>
              <Input type="password" minLength={6} required />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <div>
              <Button style={{ marginTop: 16, width: '100%' }} disabled={loading}>
                {loading ? t('confirm.label') + '...' : t('confirm.label')}
              </Button>
            </div>
          </Form.Submit>
          <div className="mt-5 color-blue flex gap-2 items-center">
            <Link to={'/login'}>{t('login.label')}</Link>
            |
            <Link to={'/find-pwd'}>
              {t('forgetPassword.message')}
            </Link>
          </div>
        </Form.Root>
      </div>
    </>
  )
}

export default ResetPwd
