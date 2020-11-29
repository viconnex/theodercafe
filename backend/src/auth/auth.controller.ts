import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ValidatedUser } from './google.strategy'
import { createFirebaseJWT } from './firebase'
import { ADMIN_STRATEGY } from './jwt.admin.strategy'

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin(): void {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req, @Res() res): void {
        // handles the Google OAuth2 callback
        const validatedUser: ValidatedUser | undefined = req.user

        if (validatedUser) {
            res.redirect(
                `${process.env.FRONT_BASE_URL}?login=success&jwt=${validatedUser.jwt}&firebase_jwt=${createFirebaseJWT(
                    validatedUser.email,
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
}
