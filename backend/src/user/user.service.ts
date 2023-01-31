import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QuestionService } from 'src/question/question.service'
import { DeleteResult } from 'typeorm'
import { PresetQuestionSet } from 'src/questionSet/questionSet.entity'
import { UserRepository } from './user.repository'
import { getCompanyFromEmail, getPresetQuestionSetFromEmail, User } from './user.entity'
import { GoogleProfile } from '../auth/google.strategy'
import { AdminUserList, CompanyDomain, PostSettingsBody, UserLocale, UserWithPublicFields } from './user.types'
import sendEmail from './emails/sendinblue'
import { ALTERODO_LUNCH_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './emails/templates'
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
            selectedQuestionSet: await this.questionSetService.findOrCreateFromName(
                getPresetQuestionSetFromEmail(email),
            ),
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

    async getUsersPictures(companyDomain: CompanyDomain | null) {
        let queryBuilder = this.userRepository.createQueryBuilder('user').where('user.isActive = true')
        if (companyDomain) {
            queryBuilder = queryBuilder.andWhere('user.email LIKE :companyDomain', {
                companyDomain: `%@${companyDomain.domain}`,
            })
        }
        const usersWithPics = await queryBuilder.select(['user.id', 'user.pictureUrl']).getMany()

        const userPicturesObject = {}
        usersWithPics.forEach((user) => {
            userPicturesObject[user.id] = user.pictureUrl
        })
        return userPicturesObject
    }

    async createOrUpdateAfterLogin(email: string, profile: GoogleProfile) {
        const user = await this.findByEmail(email)

        if (user) {
            return this.userRepository.save({ ...user, ...this.getUserInfoFromProfile(profile), isLoginPending: false })
        }

        const newUser = await this.createNewUser(email, profile)
        // TODO: send locale from client
        const locale = [PresetQuestionSet.TheodoUK, PresetQuestionSet.TheodoUS].includes(
            getPresetQuestionSetFromEmail(email),
        )
            ? UserLocale.en
            : UserLocale.fr
        void this.sendWelcomeEmail({ newUserEmail: email, userLocale: locale })

        return newUser
    }

    async createUserWithEmail(
        email: string,
        addedByUserId: number | null | undefined,
        alterodoUserId: number | null | undefined,
    ) {
        const emailLowerCase = email.toLocaleLowerCase()

        const existingUser = await this.userRepository.findOne({ email: emailLowerCase })

        if (existingUser) {
            return null
        }

        const addedByUser = addedByUserId ? (await this.userRepository.findOne({ id: addedByUserId })) ?? null : null
        const asakaiAlterodoUser = alterodoUserId
            ? (await this.userRepository.findOne({ id: alterodoUserId })) ?? null
            : null

        const newUser = await this.userRepository.save({
            email: emailLowerCase,
            company: getCompanyFromEmail(emailLowerCase),
            isAdmin: false,
            addedByUser,
            asakaiAlterodoUser,
            isLoginPending: true,
            selectedQuestionSet: await this.questionSetService.findOrCreateFromName(
                getPresetQuestionSetFromEmail(email),
            ),
        })

        return { newUser, addedByUser, asakaiAlterodoUser }
    }

    async sendWelcomeEmail({ newUserEmail, userLocale }: { newUserEmail: string; userLocale: UserLocale }) {
        let subject = 'Tea or Coffee ?'
        if (userLocale === UserLocale.fr) {
            const questions = await this.questionService.find({ where: { isValidated: true } })
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
            subject = randomQuestion ? `${randomQuestion.option1} ou ${randomQuestion.option2} ?` : 'Thé ou café ?'
        }

        const isEmailSent = await sendEmail([newUserEmail], [], subject, WELCOME_EMAIL_TEMPLATE[userLocale])

        if (isEmailSent) {
            console.log('welcome email sent')
        } else {
            console.log('error while sending welcome email')
            throw new BadRequestException({ code: 'mail-service-error', message: 'service de mail indisponible' })
        }
    }

    async sendAlterodoLunchProposalEmail({
        newUserEmail,
        alterodoUser,
        varietoUser,
        coachUserEmail,
        userLocale,
    }: {
        newUserEmail?: string
        alterodoUser: User | null
        varietoUser: User | null
        coachUserEmail?: string
        userLocale: UserLocale
    }) {
        const recipients: string[] = []
        const cc: string[] = []

        if (newUserEmail) {
            recipients.push(newUserEmail)
        }
        if (alterodoUser?.email) {
            recipients.push(alterodoUser.email)
        }
        if (varietoUser?.email) {
            recipients.push(varietoUser.email)
        }
        if (coachUserEmail) {
            cc.push(coachUserEmail)
        }

        const isEmailSent = await sendEmail(recipients, cc, 'Dej Alterodos', ALTERODO_LUNCH_TEMPLATE[userLocale])

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
