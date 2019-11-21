import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User, getCompanyFromEmail } from './user.entity';
import { GoogleProfile } from 'src/auth/google.strategy';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email });
    }

    createNewUser(email: string, profile: GoogleProfile, isAdmin?: boolean): Promise<User> {
        return this.userRepository.save({
            email,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
            company: getCompanyFromEmail(email),
            isAdmin: isAdmin || false,
        });
    }
}
