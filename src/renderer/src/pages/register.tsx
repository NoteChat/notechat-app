import React, { useCallback, useEffect, useState } from 'react'
import * as Form from '@radix-ui/react-form'
import API, { UserRegisterDto } from '@renderer/api'
import { Link, useNavigate } from 'react-router-dom'
import md5 from 'js-md5'

const Register: React.FC<{}> = () => {
  const navigate = useNavigate()
  const [countDown, setCountDown] = useState(0)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const user = Object.fromEntries(new FormData(e.currentTarget))
    if (user.password !== user.confirmPassword) {
      alert('The passwords entered twice are inconsistent!')
      return
    }
    user.password = md5(user.password);
    API.v1
      .register(user as unknown as UserRegisterDto)
      .then((res: any) => {
        if (res.code !== 1000) {
          alert(res.message);
        } else {
          navigate('/login');
        }
      })
      .catch((err: any) => {
        console.log('register err: ', err)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const sendValidateCode = () => {
    const email = document.querySelector('input[name="email"]') as HTMLInputElement
    if (email) {
      API.v1.getValidCode({ email: email.value }).then((res: any) => {
        if (res.code !== 1000) {
          setCountDown(60)
          alert(res.message)
        }
      })
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
    localStorage.clear();
  }, [])

  return (
    <div className="centerBlock" style={{ top: '40%' }}>
      <h1 className="font-500 text-center">Register</h1>
      <Form.Root className="FormRoot m-auto mt-5" onSubmit={onSubmit} method="POST">
        <Form.Field className="FormField" name="email">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Email</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your email
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="email" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="password">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Password</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your password
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input type="password" className="Input" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="confirmPassword">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Confirm Password</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your password
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input type="password" className="Textarea" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="validCode">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Validation Code</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your Email Validation Code
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input type="number" min={0} className="Input" required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <div>
            <button
              style={{ width: 130 }}
              className="Button"
              onClick={sendValidateCode}
              disabled={countDown > 0}
            >
              {countDown > 0 ? `Resend(${countDown} s)` : 'Send'}
            </button>
            <button className="Button ml-2" style={{ marginTop: 10, width: 160 }} disabled={loading}>
              {loading ? 'Register...' : 'Register'}
            </button>
          </div>
        </Form.Submit>
        <div className="mt-5 color-blue">
          <Link to={'/login'}>Login</Link>
        </div>
      </Form.Root>
    </div>
  )
}

export default Register
