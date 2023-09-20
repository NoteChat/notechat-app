import Api, { UserDto } from '@renderer/api'
import currency from 'currency.js'
import { changeLanguage } from 'i18next'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export interface UserContextProps {
  user: UserDto | undefined
  setUser: (user: UserDto) => void
  updateProfile: (user: UserDto, silent?: boolean) => void
  onChangeLang: (lang: string) => void
  loadProfile: () => void,
  shouldCharge: () => boolean
}

const initialContext: UserContextProps = {
  user: undefined,
  setUser: () => {},
  updateProfile: () => {},
  onChangeLang: () => {},
  loadProfile: () => {},
  shouldCharge: () => false
}

export function getLocale() {
  return localStorage.getItem('lang') || navigator.language
}

export function changeUserLanguage(lang) {
  const setVal = lang || 'en'
  localStorage.setItem('lang', setVal)
  changeLanguage(setVal)
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
        sessionStorage.setItem('aiEngine', res.data.aiEngine)
        changeUserLanguage(res.data.language)
      }
    }).catch((err) => {
      if (err.status === 401) {
        navigate('/login')
      }
      console.log('get profile failed', err)
    })
  }

  const updateProfile = (userData: UserDto, silent = false) => {
    if (userData) {
        setUser({ ... user, ...userData })
        if (userData.aiEngine) {
          sessionStorage.setItem('aiEngine', userData.aiEngine)
        }
    }
    Api.v1.updateProfile(userData).then((res) => {
      if (res.ok) {
        if (!silent) toast.success('Update Success')
      } else {
        console.log('update profile failed', res)
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

  const shouldCharge = () => {
    if (!user) return false;
    const balance = user?.balance ? currency(user.balance, { fromCents: false, precision: 3 }).value : 0;
    return  balance <= 0 && user.aiEngine !== 'gpt-3.5-turbo';
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
        loadProfile,
        shouldCharge
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
