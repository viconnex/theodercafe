import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload } from 'src/auth/auth.types'
import { ValidatedUser } from './google.strategy'
import { createFirebaseJWT } from './firebase'
import { ADMIN_STRATEGY } from './jwt.admin.strategy'
import { USER_STRATEGY } from './jwt.user.strategy'

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin(): void {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req: { user?: ValidatedUser }, @Res() res): void {
        // handles the Google OAuth2 callback
        const validatedUser = req.user

        if (validatedUser) {
            res.redirect(
                `${process.env.FRONT_BASE_URL}?login=success&jwt=${validatedUser.jwt}&firebase_jwt=${createFirebaseJWT(
                    validatedUser.id,
                )}`,
            )
        } else {
            res.redirect(`${process.env.FRONT_BASE_URL}?login=failure`)
        }
    }

    @Get('protected')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    protectedResource(): string {
        return 'JWT is working!'
    }

    @Get('refresh_firebase_token')
    @UseGuards(AuthGuard(USER_STRATEGY))
    createUserFirebaseToken(@Req() req: { user: JwtPayload }) {
        return { token: createFirebaseJWT(req.user.id) }
    }
}
