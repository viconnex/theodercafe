import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserTable1567379099964 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "givenName" character varying, "familyName" character varying, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`DROP TABLE "users"`)
    }
}
