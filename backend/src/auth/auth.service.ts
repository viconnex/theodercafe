import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

export enum Provider {
    GOOGLE = 'google',
}

const getEmail = (emails: { value: string }[]): string | null => {
    for (var i = 0; i < emails.length; i++) {
        if (emails[i].value.split('@')[1] === 'theodo.fr') {
            return emails[i].value;
        }
    }
    return null;
};

@Injectable()
export class AuthService {
    private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    constructor(private readonly userService: UserService) {}

    async validateOAuthLogin(thirdPartyId: string, emails: { value: string }[], provider: Provider): Promise<string> {
        try {
            // You can add some registration logic here,
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

            // if (!user)
            // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
            const email = getEmail(emails);
            if (!email) return;

            const user = await this.userService.findByEmail(email);
            const role = user && user.isAdmin ? 'admin' : 'nonAdmin';

            const payload = {
                thirdPartyId,
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
}
