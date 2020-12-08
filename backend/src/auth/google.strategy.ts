import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { getEmailFromGoogleProfile } from './utils'
import { AuthService } from './auth.service'

export interface GoogleProfile {
    id: string
    displayName: string
    name: null | { familyName?: string; givenName?: string }
    emails: { value: string; verified: boolean }[]
    photos: { value: string }[]
}
export interface ValidatedUser {
    jwt: string
    email: string
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        })
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: Function,
    ): Promise<void> {
        try {
            const jwt = await this.authService.validateOAuthLogin(profile)
            const email = getEmailFromGoogleProfile(profile)
            if (!jwt || !email) {
                done(null, false)
                return
            }
            const user: ValidatedUser = {
                jwt,
                email,
            }

            done(null, user)
        } catch (err) {
            done(err, false)
        }
    }
}
