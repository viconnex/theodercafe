import { MigrationInterface, QueryRunner } from 'typeorm'
import { getPresetQuestionSetFromEmail, User } from '../src/user/user.entity'
import { PresetQuestionSet, QuestionSet } from '../src/questionSet/questionSet.entity'

export class AddUserSelectedQuestionSet1661112326406 implements MigrationInterface {
    name = 'AddUserSelectedQuestionSet1661112326406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "selectedQuestionSetId" integer`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_a062df31f9332fd20de006901e0" FOREIGN KEY ("selectedQuestionSetId") REFERENCES "question_set"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
        await queryRunner.commitTransaction()
        await queryRunner.startTransaction()

        const userRepository = queryRunner.connection.getRepository(User)
        const questionSetRepository = queryRunner.connection.getRepository(QuestionSet)
        const theodoFR = await questionSetRepository.findOneOrFail({ name: PresetQuestionSet.TheodoFR })
        const theodoUS = await questionSetRepository.findOneOrFail({ name: PresetQuestionSet.TheodoUS })

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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a062df31f9332fd20de006901e0"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "selectedQuestionSetId"`, undefined)
    }
}
