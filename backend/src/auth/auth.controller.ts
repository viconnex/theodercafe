import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
        const jwt: string = req.user.jwt;
        if (jwt) res.redirect(`${process.env.FRONT_BASE_URL}/login/success/` + jwt);
        else res.redirect(`${process.env.FRONT_BASE_URL}/login/success/login/failure`);
    }

    @Get('protected')
    @UseGuards(AuthGuard('jwt'))
    protectedResource(): string {
        return 'JWT is working!';
    }
}
