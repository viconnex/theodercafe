import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { User, getCompanyFromEmail } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { UserWithPublicFields } from './user.types'
import { MailerService } from '@nestjs-modules/mailer'
import { QuestionService } from 'src/question/question.service'
import { Question } from 'src/question/question.entity'

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

    createNewUser(email: string, profile: GoogleProfile): Promise<User> {
        return this.userRepository.save({
            email,
            company: getCompanyFromEmail(email),
            isAdmin: false,
            ...this.getUserInfoFromProfile(profile),
        })
    }

    getUserInfoFromProfile(profile) {
        return {
            givenName: profile.name ? profile.name.givenName : 'email',
            familyName: profile.name ? profile.name.familyName : ' ',
            pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
        }
    }

    async createOrUpdate(email: string, profile: GoogleProfile): Promise<User> {
        const user = await this.findByEmail(email)

        if (user) {
            return this.userRepository.save({ ...user, ...this.getUserInfoFromProfile(profile) })
        }

        return user ?? this.createNewUser(email, profile)
    }

    async createUserWithEmail(
        email: string,
        addedByUserId: number | null,
        alterodoUserId: number | null,
    ): Promise<User | null> {
        const emailParts = email.split('@')
        if (emailParts.length < 2 || !emailParts[0].length || !emailParts[1].length) {
            throw new BadRequestException('you must provide a valid email address')
        }

        const existingUser = await this.userRepository.findOne({ email })
        if (existingUser && !existingUser.isAdmin) {
            throw new BadRequestException('there is already an user with the specified email')
        }
        const addedByUser = addedByUserId ? await this.userRepository.findOne({ id: addedByUserId }) : null
        const asakaiAlterodoUser = alterodoUserId ? await this.userRepository.findOne({ id: alterodoUserId }) : null

        let newUser = null
        if (!existingUser) {
            newUser = await this.userRepository.save({
                email,
                company: getCompanyFromEmail(email),
                isAdmin: false,
                addedByUser,
                asakaiAlterodoUser,
            })
        }

        const questions = await this.questionService.find({ where: { isValidated: true } })
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
        const subject = randomQuestion ? `${randomQuestion.option1} ou ${randomQuestion.option2} ?` : 'Thé ou café ?'

        try {
            await this.mailerService.sendMail({
                to: email,
                cc: 'victorl@theodo.fr',
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

        return newUser
    }
}
