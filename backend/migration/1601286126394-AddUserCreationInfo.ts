import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserCreationInfo1601286126394 implements MigrationInterface {
    name = 'AddUserCreationInfo1601286126394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "addedByUserId" integer`, undefined)
        await queryRunner.query(`ALTER TABLE "users" ADD "asakaiAlterodoUserId" integer`, undefined)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_5b59859acbc0746516401df97e2" FOREIGN KEY ("addedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_d67b1b71695acb58321d3535f42" FOREIGN KEY ("asakaiAlterodoUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d67b1b71695acb58321d3535f42"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5b59859acbc0746516401df97e2"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "asakaiAlterodoUserId"`, undefined)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "addedByUserId"`, undefined)
    }
}
