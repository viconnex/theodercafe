import { Controller, Get, HttpException, Req, Res, UseGuards } from '@nestjs/common'
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
        if (!validatedUser) {
            res.redirect(`${process.env.FRONT_BASE_URL}?login=failure`)
            return
        }
        let redirectUrl = `${process.env.FRONT_BASE_URL}?login=success&jwt_token=${validatedUser.jwt}`
        let firebaseToken: null | string = null
        try {
            firebaseToken = createFirebaseJWT(validatedUser.id)
        } catch (e) {
            console.log("Couldn't create firebase token", e)
        }
        if (firebaseToken) {
            redirectUrl += `&firebase_token=${firebaseToken}`
        }
        res.redirect(redirectUrl)
    }

    @Get('protected')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    protectedResource(): string {
        return 'JWT is working!'
    }

    @Get('refresh_firebase_token')
    @UseGuards(AuthGuard(USER_STRATEGY))
    createUserFirebaseToken(@Req() req: { user: JwtPayload }) {
        try {
            return { token: createFirebaseJWT(req.user.id) }
        } catch (e) {
            throw new HttpException("Couldn't create firebase token", 500)
        }
    }
}
