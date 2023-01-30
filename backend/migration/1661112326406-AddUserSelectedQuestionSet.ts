import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserSelectedQuestionSet1661112326406 implements MigrationInterface {
    name = 'AddUserSelectedQuestionSet1661112326406'

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "selectedQuestionSetId" integer`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_a062df31f9332fd20de006901e0" FOREIGN KEY ("selectedQuestionSetId") REFERENCES "question_set"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
        await queryRunner.commitTransaction()
        await queryRunner.startTransaction()
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a062df31f9332fd20de006901e0"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "selectedQuestionSetId"`, undefined)
    }
}
