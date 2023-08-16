import React, { useCallback, useState } from 'react'
import * as Form from '@radix-ui/react-form'
import API from '@renderer/api'
import { Link } from 'react-router-dom'
import { Button, Input } from '@renderer/components/form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import logo from '@renderer/assets/128@2x.png'

const FindPwd: React.FC<{}> = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    if (!formData.email) return;
    setSuccess(false)

    API.v1
      .findPassword({
        email: formData.email,
        resetUrl: `${window.location.protocol}//${window.location.host}/#/reset-pwd`,
      })
      .then((res: any) => {
        const { data } = res
        if (data.code !== 1000) {
          toast.error(data.message)
        } else {
          setSuccess(true)
          toast.success(t('findPwd.success'))
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
        <h1 className="font-500 text-center">{t('findPwd.label')}</h1>
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
          {success && (
            <div>
              <p className="color-orange">{t('findPwd.success')}</p>
            </div>
          )}
          <Form.Submit asChild>
            <div>
              <Button style={{ marginTop: 16, width: '100%' }} disabled={loading}>
                {loading ? t('confirm.label') + '...' : t('confirm.label')}
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

export default FindPwd
