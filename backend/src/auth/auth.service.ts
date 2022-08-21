import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { getEmailFromGoogleProfile } from './utils'
import { UserService } from '../user/user.service'
import { GoogleProfile } from './google.strategy'
import { JwtPayload } from './auth.types'

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

            const user = await this.userService.createOrUpdateAfterLogin(email, profile)

            const payload: JwtPayload = {
                id: user.id,
                email,
                role: user?.isAdmin ? 'admin' : 'nonAdmin',
                givenName: user.givenName,
                familyName: user.familyName,
                pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
            }

            if (this.JWT_SECRET_KEY) {
                return { jwt: sign(payload, this.JWT_SECRET_KEY), userId: user.id }
            } else {
                throw new Error('no JWT_SECRET_KEY found')
            }
        } catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message)
        }
    }

    async verifyAdminRequest(id: number): Promise<boolean> {
        const user = await this.userService.findOne(id)
        return !!user && user.isAdmin
    }

    async verifyRegisteredUserRequest(id: number) {
        return await this.userService.findOne(id)
    }
}
