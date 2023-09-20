import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export const checkUserAuthentication = () => {
  return localStorage.getItem('token') !== null
}

const withAuthInterceptor = (WrappedComponent) => {
  return (props: React.ComponentProps<any>) => {
    const isAuthenticated = checkUserAuthentication() // Implement this function based on your authentication logic
    return <>{isAuthenticated ? <WrappedComponent {...props} /> : <Navigate to="/login" />}</>
  }
}

export const Layout: React.FC = (props: React.PropsWithChildren) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!checkUserAuthentication()) {
      navigate('/login')
    }
  }, [])
  return <div className="w-full h-full">{props.children}</div>
}

export default withAuthInterceptor
