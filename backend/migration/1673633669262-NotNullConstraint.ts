import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotNullConstraint1673633669262 implements MigrationInterface {
    name = 'NotNullConstraint1673633669262'

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a062df31f9332fd20de006901e0"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "selectedQuestionSetId" SET NOT NULL`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_a062df31f9332fd20de006901e0" FOREIGN KEY ("selectedQuestionSetId") REFERENCES "question_set"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a062df31f9332fd20de006901e0"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "selectedQuestionSetId" DROP NOT NULL`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_a062df31f9332fd20de006901e0" FOREIGN KEY ("selectedQuestionSetId") REFERENCES "question_set"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }
}
