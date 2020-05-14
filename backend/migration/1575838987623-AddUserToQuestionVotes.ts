import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserToQuestionVotes1575838987623 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "user_to_question_votes" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer NOT NULL, "isUpVote" boolean NOT NULL, CONSTRAINT "PK_55d9bbb8a38b074c2fbdbdc11e1" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_325b752794b4dcc587759a064e6" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_08371300fa7ce544923d9edcd1b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_08371300fa7ce544923d9edcd1b"`)
        await queryRunner.query(`ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_325b752794b4dcc587759a064e6"`)
        await queryRunner.query(`DROP TABLE "user_to_question_votes"`)
    }
}
