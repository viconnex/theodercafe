import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsAboutSomeoneColumnToQuestion1567266002464 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isJokeOnSomeone" boolean NOT NULL DEFAULT false`)
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isJokeOnSomeone"`)
    }
}
