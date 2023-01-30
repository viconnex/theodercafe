import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCategories1561586891486 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" RENAME COLUMN "category" TO "categoryId"`)
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "categoryId"`)
        await queryRunner.query(`ALTER TABLE "questions" ADD "categoryId" integer`)
        await queryRunner.query(
            `ALTER TABLE "questions" ADD CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc"`)
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "categoryId"`)
        await queryRunner.query(`ALTER TABLE "questions" ADD "categoryId" character varying`)
        await queryRunner.query(`DROP TABLE "categories"`)
        await queryRunner.query(`ALTER TABLE "questions" RENAME COLUMN "categoryId" TO "category"`)
    }
}
