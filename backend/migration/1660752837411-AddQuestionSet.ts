import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddQuestionSet1660752837411 implements MigrationInterface {
    name = 'AddQuestionSet1660752837411'

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(
            `CREATE TABLE "question_set" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_384a616ea05ec06da55c844430b" PRIMARY KEY ("id"))`,
            undefined,
        )
        await queryRunner.query(
            `CREATE TABLE "question_set_questions" ("questionSetId" integer NOT NULL, "questionsId" integer NOT NULL, CONSTRAINT "PK_634a718880c073e3764fb0a7ab6" PRIMARY KEY ("questionSetId", "questionsId"))`,
            undefined,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_8b70aacbf363d740dbb1f5b501" ON "question_set_questions" ("questionSetId") `,
            undefined,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_e9933e8c55c2a9ad3334daaf3c" ON "question_set_questions" ("questionsId") `,
            undefined,
        )
        await queryRunner.query(
            `ALTER TABLE "question_set_questions" ADD CONSTRAINT "FK_8b70aacbf363d740dbb1f5b501b" FOREIGN KEY ("questionSetId") REFERENCES "question_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        )
        await queryRunner.query(
            `ALTER TABLE "question_set_questions" ADD CONSTRAINT "FK_e9933e8c55c2a9ad3334daaf3c0" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        )
        await queryRunner.commitTransaction()
        await queryRunner.startTransaction()
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(
            `ALTER TABLE "question_set_questions" DROP CONSTRAINT "FK_e9933e8c55c2a9ad3334daaf3c0"`,
            undefined,
        )
        await queryRunner.query(
            `ALTER TABLE "question_set_questions" DROP CONSTRAINT "FK_8b70aacbf363d740dbb1f5b501b"`,
            undefined,
        )
        await queryRunner.query(`DROP INDEX "IDX_e9933e8c55c2a9ad3334daaf3c"`, undefined)
        await queryRunner.query(`DROP INDEX "IDX_8b70aacbf363d740dbb1f5b501"`, undefined)
        await queryRunner.query(`DROP TABLE "question_set_questions"`, undefined)
        await queryRunner.query(`DROP TABLE "question_set"`, undefined)
    }
}
