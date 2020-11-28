import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { UserService } from '../user/user.service'
import { GoogleProfile } from './google.strategy'

export enum Provider {
    GOOGLE = 'google',
}

@Injectable()
export class AuthService {
    private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

    constructor(private readonly userService: UserService) {}

    async validateOAuthLogin(profile: GoogleProfile): Promise<string> {
        const issuingTime = Date.now() / 1000
        const expirationTime = issuingTime + 3600 // Maximum expiration time is one hour
        try {
            const email = profile.emails.length > 0 ? profile.emails[0].value : null
            if (!email) return

            const user = await this.userService.createOrUpdate(email, profile)

            const payload = {
                id: user.id,
                email,
                role: user && user.isAdmin ? 'admin' : 'nonAdmin',
                givenName: user.givenName,
                familyName: user.familyName,
                pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
                iss: 'firebase-adminsdk-iglrm@maposaic-99785.iam.gserviceaccount.com',
                sub: 'firebase-adminsdk-iglrm@maposaic-99785.iam.gserviceaccount.com',
                aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
                iat: issuingTime,
                exp: expirationTime,
                uid: email,
                claims: {
                    premiumAccount: 'coucou',
                },
            }
            const jwt: string = sign(payload, this.JWT_SECRET_KEY)
            return jwt
        } catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message)
        }
    }

    async verifyAdminRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email)
        return user && user.isAdmin
    }

    async verifyRegisteredUserRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email)
        if (user) {
            return true
        }
    }
}
