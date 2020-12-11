import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'

export const USER_STRATEGY = 'user'

@Injectable()
export class JwtRegisteredUserStrategy extends PassportStrategy(Strategy, USER_STRATEGY) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        })
    }

    async validate(payload, done: Function): Promise<void> {
        try {
            const validClaims = await this.authService.verifyRegisteredUserRequest(payload.email)

            if (!validClaims) {
                return done(new UnauthorizedException('invalid token claims'), false)
            }

            done(null, payload)
        } catch (err) {
            throw new UnauthorizedException('unauthorized', err.message)
        }
    }
}
