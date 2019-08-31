import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.AUTH2_CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:4000/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile'],
        });
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function): Promise<void> {
        try {
            console.log(profile);

            const jwt = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user = {
                jwt,
            };

            done(null, user);
        } catch (err) {
            console.log(err);
            done(err, false);
        }
    }
}
