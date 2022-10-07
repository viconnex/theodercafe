import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddQuestionAddedByUserId1665040826870 implements MigrationInterface {
    name = 'AddQuestionAddedByUserId1665040826870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "addedByUserId" integer`, undefined)
        await queryRunner.query(
            `ALTER TABLE "questions" ADD CONSTRAINT "FK_fe41ff5db9a87ea0b7f0eea6833" FOREIGN KEY ("addedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_fe41ff5db9a87ea0b7f0eea6833"`, undefined)
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "addedByUserId"`, undefined)
    }
}
