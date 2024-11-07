import { IconType } from 'react-icons/lib'

export interface IUserState {
  id: string
  username: string
  email: string
  role: string
  accessToken?: string
  message?: string
  isLoading: boolean
}

export interface ISimpleStep {
  title: string
  description: string
  image: string
}

export interface IReview {
  icon: IconType
  name: string
  star: IconType
  totalStar: number
  description: string
  date: string
}

export interface IFaq {
  title: string
  description: string
}

export interface IDataFormSettingSelect {
  label: string
  placeholder: string
  selectItem: string[]
}
