import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserColumns1574145029128 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "company" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pictureUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pictureUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "company"`);
    }

}
