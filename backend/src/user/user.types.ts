export interface UserWithPublicFields {
    id: number
    givenName: string
    familyName: string
    pictureUrl: string
}

export interface UserEmailPostBody {
    email?: string
}
