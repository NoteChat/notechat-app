import React from 'react'
import * as Form from '@radix-ui/react-form'
import API from '@renderer/api'
import { Link, useNavigate } from 'react-router-dom'
import md5 from 'js-md5'

const Login: React.FC<{}> = () => {
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
      })
      .then((res: any) => {
        if (res.code !== 1000) {
          alert('Incorrect Username or Password!')
        } else if (res.data.access_token) {
            alert('Login Success!');
            const { access_token, userId } = res.data;
            localStorage.setItem('token', access_token)
            localStorage.setItem('uid', userId)
            navigate('/')
        }
      }).catch((e) => {
        console.log('login err: ', e)
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="centerBlock" style={{ top: '40%' }}>
      <h1 className="font-500 text-center">Login</h1>
      <Form.Root className="FormRoot m-auto mt-5" onSubmit={onSubmit} method="POST">
        <Form.Field className="FormField" name="username">
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
            <input type="password" className="Textarea" required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }} disabled={loading}>
            { loading ? 'Login...' : 'Login' }
          </button>
        </Form.Submit>
        <div className="mt-5 color-blue">
          <Link to={'/register'}>Register</Link>
        </div>
      </Form.Root>
    </div>
  )
}

export default Login
