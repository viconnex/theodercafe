import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { User, getCompanyFromEmail } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { UserWithPublicFields } from './user.types'

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

    async findWithPublicFields(ids: number[]): Promise<UserWithPublicFields[]> {
        return this.userRepository.findByIds(ids, { select: ['id', 'givenName', 'familyName', 'pictureUrl'] })
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email })
    }

    createNewUser(email: string, profile: GoogleProfile, isAdmin?: boolean): Promise<User> {
        return this.userRepository.save({
            email,
            givenName: profile.name ? profile.name.givenName : 'email',
            familyName: profile.name ? profile.name.familyName : ' ',
            pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
            company: getCompanyFromEmail(email),
            isAdmin: isAdmin || false,
        })
    }

    async createUserWithEmail(email: string): Promise<User> {
        const emailParts = email.split('@')
        if (emailParts.length < 2 || !emailParts[0].length || !emailParts[1].length) {
            throw new BadRequestException('you must provide a valid email address')
        }

        const userSavedWithEmail = await this.userRepository.findOne({ email })
        if (userSavedWithEmail) {
            throw new BadRequestException('an user with the same email already exists')
        }
        return this.userRepository.save({
            email,
            company: getCompanyFromEmail(email),
            isAdmin: false,
        })
    }
}
