import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsDeleted1759473622146 implements MigrationInterface {
    name = 'AddIsDeleted1759473622146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "isDeleted" boolean NOT NULL DEFAULT false`, undefined)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "isDeleted"`, undefined)
    }
}
