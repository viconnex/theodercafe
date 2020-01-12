import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsJokeColumnToQuestions1578828572957 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isJoke" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isJoke"`);
    }
}
