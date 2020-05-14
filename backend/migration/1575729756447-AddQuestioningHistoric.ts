import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddQuestioningHistoric1575729756447 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "questioning_historic" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "questioning" text NOT NULL, CONSTRAINT "PK_13b66da2dc9550514da06b3ebe0" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_7db5fe0e9fcd308365ade0f341" ON "questioning_historic" ("date") `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_7db5fe0e9fcd308365ade0f341"`)
        await queryRunner.query(`DROP TABLE "questioning_historic"`)
    }
}
