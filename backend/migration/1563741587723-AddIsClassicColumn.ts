import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsClassicColumn1563741587723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "option1" character varying NOT NULL, "option2" character varying NOT NULL, "isClassic" boolean NOT NULL DEFAULT false, "option1Votes" integer NOT NULL DEFAULT 0, "option2Votes" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isClassic"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isClassic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option2Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "option1Votes"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isClassic"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option2Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "option1Votes" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "isClassic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "questions"`);
    }

}
