import { MigrationInterface, QueryRunner } from 'typeorm'

export class QuestioningHistoricQuestionSetId1661290287855 implements MigrationInterface {
    name = 'QuestioningHistoricQuestionSetId1661290287855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questioning_historic" ADD "questionSetId" integer`, undefined)
        await queryRunner.query(
            `ALTER TABLE "questioning_historic" ADD CONSTRAINT "FK_4786ca0e1aab8f753d3eca7eab1" FOREIGN KEY ("questionSetId") REFERENCES "question_set"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "questioning_historic" DROP CONSTRAINT "FK_4786ca0e1aab8f753d3eca7eab1"`,
            undefined,
        )
        await queryRunner.query(`ALTER TABLE "questioning_historic" DROP COLUMN "questionSetId"`, undefined)
    }
}
