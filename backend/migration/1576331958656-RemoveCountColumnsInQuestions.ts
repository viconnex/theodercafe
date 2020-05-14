import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveCountColumnsInQuestions1576331958656 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`)
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`)
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "upVotes"`)
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "downVotes"`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "downVotes" integer NOT NULL DEFAULT 0`)
        await queryRunner.query(`ALTER TABLE "questions" ADD "upVotes" integer NOT NULL DEFAULT 0`)
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`)
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`)
    }
}
