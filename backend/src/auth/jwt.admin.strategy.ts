import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'

export const ADMIN_STRATEGY = 'admin'

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, ADMIN_STRATEGY) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        })
    }

    async validate(payload, done: Function): Promise<void> {
        try {
            const validClaims = await this.authService.verifyAdminRequest(payload.email)

            if (!validClaims) {
                return done(new UnauthorizedException('You must be an admin'), false)
            }

            done(null, payload)
        } catch (err) {
            throw new UnauthorizedException('unauthorized', err.message)
        }
    }
}
