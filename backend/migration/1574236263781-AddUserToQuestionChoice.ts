import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToQuestionChoice1574236263781 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "user_to_question_choices" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer NOT NULL, "choice" integer NOT NULL, CONSTRAINT "PK_4beebd9e2932aeff831b41fcc9a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_f001596cbc155238a574c5abc96" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_f001596cbc155238a574c5abc96"`,
        );
        await queryRunner.query(`DROP TABLE "user_to_question_choices"`);
    }
}
