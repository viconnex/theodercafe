import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccumulusTable1565039057366 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "accumulus" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "nuages" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0dcfcc0130e5eced30dde03a2d" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "accumulus"`);
    }
}
