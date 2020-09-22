import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { User, getCompanyFromEmail } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { UserWithPublicFields } from './user.types'
import { MailerService } from '@nestjs-modules/mailer'
import { QuestionService } from 'src/question/question.service'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        private readonly questionService: QuestionService,
        private readonly mailerService: MailerService,
    ) {}

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

    async createUserWithEmail(email: string): Promise<string> {
        const emailParts = email.split('@')
        if (emailParts.length < 2 || !emailParts[0].length || !emailParts[1].length) {
            throw new BadRequestException('you must provide a valid email address')
        }

        const existingUser = await this.userRepository.findOne({ email })
        if (existingUser && !existingUser.isAdmin) {
            throw new BadRequestException('there is already an user with the specified email')
        }
        let newUser = null
        if (!existingUser) {
            newUser = await this.userRepository.save({
                email,
                company: getCompanyFromEmail(email),
                isAdmin: false,
            })
        }

        const questions = await this.questionService.find({ where: { isValidated: true } })
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
        const subject = randomQuestion ? `${randomQuestion.option1} ou ${randomQuestion.option2} ?` : 'Thé ou café ?'

        try {
            await this.mailerService.sendMail({
                to: email,
                from: 'theodercafe@gmail.com',
                subject,
                template: 'welcome',
                context: {
                    email,
                },
            })
            console.log(`email sent to ${email}`)
        } catch (e) {
            console.log('error while sending email', e)
            return
        }

        return newUser ? 'user created' : 'email sent'
    }
}
