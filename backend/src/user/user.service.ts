import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

    async findByEmail(email: string): Promise<User> {
        console.log('a votre userservice');
        return this.userRepository.findOne({ email });
    }
}
