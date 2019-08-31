import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpAndDownVoteColumnToQuestions1567258986841 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "upVotes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "downVotes" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "downVotes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "upVotes"`);
    }
}
