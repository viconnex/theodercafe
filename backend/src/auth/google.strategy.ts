import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from './auth.service';
import { boolean, string } from 'joi';

export interface GoogleProfile {
    id: string;
    displayName: string;
    name: { familyName: string; givenName: string };
    emails: { value: string; verified: boolean }[];
    photos: { value: string }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.AUTH2_CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: Function,
    ): Promise<void> {
        try {
            const jwt = await this.authService.validateOAuthLogin(profile, Provider.GOOGLE);
            const user = {
                jwt,
            };

            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
}
