import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsValidatedColumn1565680504947 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isValidated" boolean`)
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isValidated"`)
    }
}
