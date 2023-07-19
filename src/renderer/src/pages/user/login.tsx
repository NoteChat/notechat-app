import React from 'react'
import * as Form from '@radix-ui/react-form'
import API from '@renderer/api'
import { Link, useNavigate } from 'react-router-dom'
import md5 from 'js-md5'
import './style.css'
import { Button, Input } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'

const Login: React.FC<{}> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget))
    data.password = md5(data.password)
    API.v1
      .login({
        username: data.username as string,
        password: data.password as string
      }, {format: 'json'})
      .then((res: any) => {
        const { data } = res;
        if (data.code === 1000) {
          toast.success('Login Success!');
          const { access_token, userId } = data.data;
          localStorage.setItem('token', access_token)
          localStorage.setItem('uid', userId)
          navigate('/')
        } else {
          toast.error('Incorrect Username or Password!')
        }
      }).catch((e) => {
        toast.error('Login Failed!')
        console.log('login err: ', e)
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
    <div className="centerBlock" style={{ top: '40%' }}>
      <h1 className="font-500 text-center">{t('login.label')}</h1>
      <Form.Root className="FormRoot m-auto mt-5" onSubmit={onSubmit} method="POST">
        <Form.Field className="FormField" name="username">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
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
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{t('password.label')}</Form.Label>
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
        <Form.Submit asChild>
          <Button className="Button" type="submit" style={{ marginTop: 10 }} disabled={loading}>
            { loading ? t('login.label') + '...' : t('login.label') }
          </Button>
        </Form.Submit>
        <div className="mt-5 flex gap-2">
          <Link to={'/register'} className="color-blue">{t('register.label')}</Link> or
          <Link to={'/register'} className="color-blue">{t('forgetPassword.message')}</Link>
        </div>
      </Form.Root>
    </div>
      <Toaster />
      </>
  )
}

export default Login
