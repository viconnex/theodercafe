import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { IS_DEV, OWNER_EMAIL } from 'src/constants'
import { QuestionService } from 'src/question/question.service'
import { DeleteResult } from 'typeorm'
import { UserRepository } from './user.repository'
import { getCompanyFromEmail, User } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { AdminUserList, UserWithPublicFields } from './user.types'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        private readonly questionService: QuestionService,
        private readonly mailerService: MailerService,
    ) {}

    async findAdminList(): Promise<AdminUserList> {
        return this.userRepository.query(`
                    SELECT * FROM users LEFT JOIN (
                        SELECT "userId", count(*) as "answerCount" from user_to_question_choices GROUP BY "userId"
                    ) AS  user_answer_count
                    ON "user_answer_count"."userId" = users.id
                    ORDER BY "email";
                `)
    }

    findOne(id: string | number) {
        return this.userRepository.findOne(id)
    }

    update(id: string | number, user: User): Promise<User> {
        return this.userRepository.save({ ...user, id: Number(id) })
    }

    delete(id: string): Promise<DeleteResult> {
        return this.userRepository.delete(Number(id))
    }

    async findWithPublicFields(ids: number[]): Promise<UserWithPublicFields[]> {
        return this.userRepository.findByIds(ids, { select: ['id', 'givenName', 'familyName', 'pictureUrl'] })
    }

    async findOneWithPublicFields(id: number) {
        return this.userRepository.findOne({ select: ['id', 'givenName', 'familyName', 'pictureUrl'], where: { id } })
    }

    async findByEmail(email: string) {
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

    async getUsersPictures() {
        const usersWithPics = await this.userRepository.find({ select: ['id', 'pictureUrl'] })
        const userPicturesObject = {}
        usersWithPics.forEach((user) => {
            userPicturesObject[user.id] = user.pictureUrl
        })
        return userPicturesObject
    }

    async createOrUpdateAfterLogin(email: string, profile: GoogleProfile): Promise<User> {
        const user = await this.findByEmail(email)

        if (user) {
            return this.userRepository.save({ ...user, ...this.getUserInfoFromProfile(profile), isLoginPending: false })
        }

        return user ?? this.createNewUser(email, profile)
    }

    async createUserWithEmail(
        email: string,
        addedByUserId: number | null | undefined,
        alterodoUserId: number | null | undefined,
    ) {
        const emailParts = email.split('@')
        if (emailParts.length < 2 || !emailParts[0].length || !emailParts[1].length) {
            throw new BadRequestException('you must provide a valid email address')
        }
        const emailLowerCase = email.toLocaleLowerCase()

        const existingUser = await this.userRepository.findOne({ email: emailLowerCase })

        const addedByUser = addedByUserId ? (await this.userRepository.findOne({ id: addedByUserId })) ?? null : null
        const asakaiAlterodoUser = alterodoUserId
            ? (await this.userRepository.findOne({ id: alterodoUserId })) ?? null
            : null

        let newUser: null | User = null
        if (!existingUser) {
            newUser = await this.userRepository.save({
                email: emailLowerCase,
                company: getCompanyFromEmail(emailLowerCase),
                isAdmin: false,
                addedByUser,
                asakaiAlterodoUser,
                isLoginPending: true,
            })
        }

        void this.sendWelcomeEmail({ newUserEmail: emailLowerCase })

        void this.sendAlterodoLunchProposalEmail({
            newUserEmail: newUser?.email ?? existingUser?.email,
            alterodoUser: asakaiAlterodoUser,
            coachUserEmail: addedByUser?.email,
        })

        if (existingUser && !existingUser.isAdmin) {
            throw new BadRequestException({
                message: 'there is already a user with the specified email',
                code: 'existing-email',
            })
        }

        return newUser
    }

    async sendWelcomeEmail({ newUserEmail }: { newUserEmail: string }) {
        const questions = await this.questionService.find({ where: { isValidated: true } })
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
        const subject = randomQuestion ? `${randomQuestion.option1} ou ${randomQuestion.option2} ?` : 'Thé ou café ?'

        const toEmail = IS_DEV ? OWNER_EMAIL : newUserEmail
        try {
            await this.mailerService.sendMail({
                to: toEmail,
                cc: OWNER_EMAIL,
                from: 'theodercafe@gmail.com',
                subject,
                template: 'welcome',
                context: {
                    email: newUserEmail,
                },
            })
            console.log(`welcome email sent to ${newUserEmail}`)
        } catch (e) {
            console.log('error while sending email', e)
            throw new BadRequestException({ code: 'mail-service-error', message: 'service de mail indisponible' })
        }
    }

    async sendAlterodoLunchProposalEmail({
        newUserEmail,
        alterodoUser,
        coachUserEmail,
    }: {
        newUserEmail?: string
        alterodoUser: User | null
        coachUserEmail?: string
    }) {
        const recipients: string[] = []
        const cc: string[] = [OWNER_EMAIL]

        recipients.push(newUserEmail && !IS_DEV ? newUserEmail : OWNER_EMAIL)
        recipients.push(alterodoUser?.email && !IS_DEV ? alterodoUser.email : OWNER_EMAIL)
        cc.push(coachUserEmail && !IS_DEV ? coachUserEmail : OWNER_EMAIL)

        try {
            await this.mailerService.sendMail({
                to: recipients,
                cc,
                from: 'theodercafe@gmail.com',
                subject: 'Dej Alterodos',
                template: 'alterodos_lunch',
            })
            console.log('alterodos tradition email sent')
        } catch (e) {
            console.log('error while sending alterodos email', e)
        }
    }
}
