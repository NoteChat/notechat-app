import React, { useCallback, useEffect, useState } from 'react'
import * as Form from '@radix-ui/react-form'
import API, { UserRegisterDto } from '@renderer/api'
import { Link, useNavigate } from 'react-router-dom'
import md5 from 'js-md5'
import { Button, Input } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import logo from '@renderer/assets/128@2x.png'
import { getLocale } from '@renderer/utils'

const Register: React.FC<{}> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [countDown, setCountDown] = useState(0)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const user = Object.fromEntries(new FormData(e.currentTarget))
    if (user.password !== user.confirmPassword) {
      toast.error(t('password.check.notMatch'))
      setLoading(false)
      return
    }
    user.password = md5(user.password)
    user.language = getLocale()
    API.v1
      .register(user as unknown as UserRegisterDto)
      .then((res: any) => {
        const { data } = res
        if (data.code !== 1000) {
          toast.error(data.message)
        } else {
          toast.success(t('register.success'))
          navigate('/login')
        }
      })
      .catch((err: any) => {
        console.log('register err: ', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const sendValidateCode = () => {
    if (!loading) {
      const email = document.querySelector('input[name="email"]') as HTMLInputElement
      if (email) {
        setLoading(true)
        API.v1.getValidCode({ email: email.value }).then((res: any) => {
          const { data } = res
          if (data.code === 1000) {
            toast.success(t('email.send.success'))
            setCountDown(60)
          } else {
            toast.error(data.message)
          }
        }).finally(() => {
          setLoading(false)
        })
      }
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countDown > 0) {
      timer = setTimeout(() => {
        setCountDown(countDown - 1)
      }, 1000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [countDown])

  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <>
      <div className="centerBlock" style={{ top: '40%' }}>
        <div className="text-center mb-10">
          <img src={logo} width={128} height={128} style={{ borderRadius: '10px' }} />
        </div>
        <h1 className="font-500 text-center">{t('register.label')}</h1>
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
              <Input type="email" required />
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
              <Form.Message className="FormMessage" match="tooShort">
                {t('password.check.validLen')}
              </Form.Message>
            </div>
            <Form.Control asChild>
              <Input type="password" minLength={6} required />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="validCode">
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <Form.Label className="FormLabel">{t('emailValidateCode.label')}</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                {t('emailValidateCode.check.required')}
              </Form.Message>
            </div>
            <div className="flex items-center gap-2">
              <Form.Control asChild>
                <Input type="number" min={0} required />
              </Form.Control>
              <Button
                className="flex-1"
                style={{ width: 'auto' }}
                onClick={sendValidateCode}
                disabled={countDown > 0}
              >
                {countDown > 0 ? `${t('resend.button')}(${countDown} s)` : t('send.button')}
              </Button>
            </div>
          </Form.Field>
          <Form.Submit asChild>
            <div>
              <Button style={{ marginTop: 16, width: '100%' }} disabled={loading}>
                {loading ? t('register.label') + '...' : t('register.label')}
              </Button>
            </div>
          </Form.Submit>
          <div className="mt-5 color-blue">
            <Link to={'/login'}>{t('login.label')}</Link>
          </div>
        </Form.Root>
      </div>
    </>
  )
}

export default Register
