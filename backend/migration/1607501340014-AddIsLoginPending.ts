import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsLoginPending1607501340014 implements MigrationInterface {
    name = 'AddIsLoginPending1607501340014'

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "isLoginPending" boolean NOT NULL DEFAULT false`, undefined)
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isLoginPending"`, undefined)
    }
}
