import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { getEmailFromGoogleProfile } from './utils'
import { UserService } from '../user/user.service'
import { GoogleProfile } from './google.strategy'

@Injectable()
export class AuthService {
    private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

    constructor(private readonly userService: UserService) {}

    async validateOAuthLogin(profile: GoogleProfile) {
        try {
            const email = getEmailFromGoogleProfile(profile)

            if (!email) {
                return null
            }

            const user = await this.userService.createOrUpdate(email, profile)

            const payload = {
                id: user.id,
                email,
                role: user && user.isAdmin ? 'admin' : 'nonAdmin',
                givenName: user.givenName,
                familyName: user.familyName,
                pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
            }

            if (this.JWT_SECRET_KEY) {
                return sign(payload, this.JWT_SECRET_KEY)
            } else {
                throw new Error('no JWT_SECRET_KEY found')
            }
        } catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message)
        }
    }

    async verifyAdminRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email)
        return !!user && user.isAdmin
    }

    async verifyRegisteredUserRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email)
        if (user) {
            return true
        }
        return false
    }
}
