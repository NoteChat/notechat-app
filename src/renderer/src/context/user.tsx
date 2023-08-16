import Api, { UserDto } from '@renderer/api'
import { changeLanguage } from 'i18next'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface UserContextProps {
  user: UserDto | undefined
  setUser: (user: UserDto) => void
}

const initialContext: UserContextProps = {
  user: undefined,
  setUser: () => {}
}

export const UserContext = React.createContext<UserContextProps>(initialContext)

export const UserProvider: React.FC<React.PropsWithChildren> = (props) => {

  const [user, setUser] = React.useState<UserDto | undefined>(undefined)

  const navigate = useNavigate()
  const uid = localStorage.getItem('uid')

  useEffect(() => {
    if (!uid) {
      navigate('/login')
      return
    }
    Api.v1.getProfile({ id: uid }).then((res: any) => {
      if (res.data) {
        setUser(res.data)
        localStorage.setItem('lang', res.data.language)
        changeLanguage(res.data.language)
      }
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
