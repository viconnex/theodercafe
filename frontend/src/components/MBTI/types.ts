import { MBTI_TYPES } from 'utils/constants/questionConstants'

export type UserWithPublicFields = {
  id: number
  givenName: string | null
  familyName: string | null
  pictureUrl: string | null
}

export type ProfileResponse = {
  [key in keyof typeof MBTI_TYPES]?: UserWithPublicFields[]
}
export type MBTIResponse = { mbtiProfiles: ProfileResponse; hasRequestUserCompletedMbti: boolean }
