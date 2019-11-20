import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { GoogleProfile } from './google.strategy';

export enum Provider {
    GOOGLE = 'google',
}

@Injectable()
export class AuthService {
    private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    constructor(private readonly userService: UserService) {}

    async validateOAuthLogin(profile: GoogleProfile, provider: Provider): Promise<string> {
        try {
            const email = profile.emails.length > 0 ? profile.emails[0].value : null;
            if (!email) return;

            const user = await this.userService.findByEmail(email);
            if (!user) {
                this.userService.createNewUser(email, profile);
            }

            const role = user && user.isAdmin ? 'admin' : 'nonAdmin';

            const payload = {
                thirdPartyId: profile.id,
                provider,
                email,
                role,
            };

            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: '7d' });
            return jwt;
        } catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }

    async verifyAdminRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email);
        return user && user.isAdmin;
    }

    async verifyRegisteredUserRequest(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email);
        if (user) {
            return true;
        }
    }
}
