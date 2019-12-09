import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteCascada1575929485559 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_325b752794b4dcc587759a064e6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_08371300fa7ce544923d9edcd1b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_f001596cbc155238a574c5abc96"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_325b752794b4dcc587759a064e6" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_08371300fa7ce544923d9edcd1b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_f001596cbc155238a574c5abc96" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" DROP CONSTRAINT "FK_f001596cbc155238a574c5abc96"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_08371300fa7ce544923d9edcd1b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" DROP CONSTRAINT "FK_325b752794b4dcc587759a064e6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_904ddb82376cbb8134934e4c8c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_choices" ADD CONSTRAINT "FK_f001596cbc155238a574c5abc96" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_08371300fa7ce544923d9edcd1b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_to_question_votes" ADD CONSTRAINT "FK_325b752794b4dcc587759a064e6" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
