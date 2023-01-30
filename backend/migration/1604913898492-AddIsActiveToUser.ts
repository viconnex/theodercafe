import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsActiveToUser1604913898492 implements MigrationInterface {
    name = 'AddIsActiveToUser1604913898492'

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5b59859acbc0746516401df97e2"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_8824241104fbf7ac52e81f00d0f" FOREIGN KEY ("addedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8824241104fbf7ac52e81f00d0f"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_5b59859acbc0746516401df97e2" FOREIGN KEY ("addedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }
}
