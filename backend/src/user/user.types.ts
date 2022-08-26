import { User } from './user.entity'

export interface UserWithPublicFields {
    id: number
    givenName: string
    familyName: string
    pictureUrl: string
}

export type AdminUserList = (User & { answerCount: null | number })[]

export type PostSettingsBody = {
    selectedQuestionSetId: number
}
