import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVoteColumnsToQuestions1563558299498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`);
    }

}
