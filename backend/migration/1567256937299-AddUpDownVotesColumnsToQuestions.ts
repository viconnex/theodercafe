import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUpDownVotesColumnsToQuestions1567256937299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isClassic"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isValidated"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isClassic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isValidated" boolean`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "upVotes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "downVotes" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "downVotes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "upVotes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isValidated"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isClassic"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isValidated" boolean`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isClassic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`);
    }

}
