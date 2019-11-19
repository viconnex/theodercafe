import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { GoogleProfile } from 'src/auth/google.strategy';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email });
    }

    createNewUser(email: string, profile: GoogleProfile, isAdmin?: boolean): Promise<User> {
        return this.userRepository.save({
            email,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            isAdmin: isAdmin || false,
        });
    }
}
