import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QuestionService } from 'src/question/question.service'
import { DeleteResult } from 'typeorm'
import { UserRepository } from './user.repository'
import { getCompanyFromEmail, getPresetQuestionSetFromEmail, User } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { AdminUserList, CompanyDomain, PostSettingsBody, UserWithPublicFields } from './user.types'
import sendEmail from './emails/sendinblue'
import { alterodosLunch, welcomeEmail } from './emails/templates'
import { QuestionSetService } from '../questionSet/questionSet.service'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        private readonly questionSetService: QuestionSetService,
        private readonly questionService: QuestionService,
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

    async createNewUser(email: string, profile: GoogleProfile): Promise<User> {
        return this.userRepository.save({
            email,
            company: getCompanyFromEmail(email),
            isAdmin: false,
            ...this.getUserInfoFromProfile(profile),
            selectedQuestionSet: await this.questionSetService.findFromName(getPresetQuestionSetFromEmail(email)),
        })
    }

    getUserInfoFromProfile(profile) {
        return {
            givenName: profile.name ? profile.name.givenName : 'email',
            familyName: profile.name ? profile.name.familyName : ' ',
            pictureUrl: profile.photos.length > 0 ? profile.photos[0].value : null,
        }
    }

    async getUserWithQuestionSet(user: User) {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.selectedQuestionSet', 'question_set')
            .select([
                'user.company',
                'user.createdAt',
                'user.email',
                'user.familyName',
                'user.givenName',
                'user.id',
                'user.isActive',
                'user.isAdmin',
                'user.isLoginPending',
                'user.pictureUrl',
                'question_set.id',
                'question_set.name',
            ])
            .where('user.id = :id', { id: user.id })
            .getOne()
    }

    async getUsersPictures(companyDomain: CompanyDomain) {
        const usersWithPics = await this.userRepository
            .createQueryBuilder('user')
            .where('user.email LIKE :companyDomain', { companyDomain: `%@${companyDomain.domain}` })
            .select(['user.id', 'user.pictureUrl'])
            .getMany()
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

        return await this.createNewUser(email, profile)
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
                selectedQuestionSet: await this.questionSetService.findFromName(getPresetQuestionSetFromEmail(email)),
            })
        }

        if (!existingUser || existingUser.isAdmin) {
            void this.sendWelcomeEmail({ newUserEmail: emailLowerCase })
        }

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

        const isEmailSent = await sendEmail([newUserEmail], [], subject, welcomeEmail)

        if (isEmailSent) {
            console.log('welcome email sent')
        } else {
            console.log('error while sending alterodos email')
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
        const cc: string[] = []

        if (newUserEmail) {
            recipients.push(newUserEmail)
        }
        if (alterodoUser?.email) {
            recipients.push(alterodoUser.email)
        }
        if (coachUserEmail) {
            cc.push(coachUserEmail)
        }

        const isEmailSent = await sendEmail(recipients, cc, 'Dej Alterodos', alterodosLunch)

        if (isEmailSent) {
            console.log('alterodos tradition email sent')
        } else {
            console.log('error while sending alterodos email')
        }
    }

    async changeSettings({ user, settings }: { user: User; settings: PostSettingsBody }) {
        const questionSet = await this.questionSetService.findOneOrFail(settings.selectedQuestionSetId)
        return await this.userRepository.save({ ...user, selectedQuestionSet: questionSet })
    }
}
