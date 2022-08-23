import { MigrationInterface, QueryRunner } from 'typeorm'
import { getPresetQuestionSetFromEmail, User } from '../src/user/user.entity'
import { PresetQuestionSet, QuestionSet } from '../src/questionSet/questionSet.entity'

export class FillUserSelectedQuestionSet1661112326407 implements MigrationInterface {
    name = 'FillUserSelectedQuestionSet1661112326407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.connection.getRepository(User)
        const questionSetRepository = queryRunner.connection.getRepository(QuestionSet)
        let theodoFR = await questionSetRepository.findOne({ name: PresetQuestionSet.TheodoFR })
        if (!theodoFR) {
            theodoFR = await questionSetRepository.save({ name: PresetQuestionSet.TheodoFR })
        }
        let theodoUS = await questionSetRepository.findOne({ name: PresetQuestionSet.TheodoUS })
        if (!theodoUS) {
            theodoUS = await questionSetRepository.save({ name: PresetQuestionSet.TheodoUS })
        }
        const allUsers = await userRepository.find()

        for (const user of allUsers) {
            const presetQuestionSet = getPresetQuestionSetFromEmail(user.email)
            if (presetQuestionSet === PresetQuestionSet.TheodoUS) {
                user.selectedQuestionSet = theodoUS
            } else {
                user.selectedQuestionSet = theodoFR
            }
        }

        await userRepository.save(allUsers)
    }

    public down() {
        return Promise.resolve()
    }
}
