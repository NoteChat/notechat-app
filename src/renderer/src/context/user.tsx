import Api, { UserDto } from '@renderer/api'
import { changeLanguage } from 'i18next'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export interface UserContextProps {
  user: UserDto | undefined
  setUser: (user: UserDto) => void
  updateProfile: (user: UserDto) => void
  onChangeLang: (lang: string) => void
  loadProfile: () => void
}

const initialContext: UserContextProps = {
  user: undefined,
  setUser: () => {},
  updateProfile: () => {},
  onChangeLang: () => {},
  loadProfile: () => {}
}

export function getLocale() {
  return localStorage.getItem('lang') || navigator.language
}

export function changeUserLanguage(lang) {
  localStorage.setItem('lang', lang)
  changeLanguage(lang)
}

export const UserContext = React.createContext<UserContextProps>(initialContext)

export const UserProvider: React.FC<React.PropsWithChildren> = (props) => {

  const [user, setUser] = React.useState<UserDto | undefined>(undefined)

  const navigate = useNavigate()
  const uid = localStorage.getItem('uid')

  const loadProfile = () => {
    if (!uid) {
      navigate('/login')
      return
    }
    Api.v1.getProfile({ id: uid }).then((res: any) => {
      if (res.data) {
        setUser(res.data)
        changeUserLanguage(res.data.language)
      }
    }).catch((err) => {
      if (err.status === 401) {
        navigate('/login')
      }
      console.log('get profile failed', err)
    })
  }

  const updateProfile = (userData: UserDto) => {
      Api.v1.updateProfile(userData).then((res) => {
        if (res.ok) {
          setUser({ ... res.data })
          toast.success('Update Success')
        } else {
          console.log('udpate profile failed', res)
        }
      })
  }

  const onChangeLang = (lang) => {
    if (lang) {
      changeUserLanguage(lang)
      if (user) {
        updateProfile({ ...user, language: lang } as UserDto)
      }
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateProfile,
        onChangeLang,
        loadProfile
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
