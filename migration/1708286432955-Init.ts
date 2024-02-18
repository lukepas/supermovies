import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1708286432955 implements MigrationInterface {
  name = 'Init1708286432955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'ADMIN', "googleId" character varying, "password" character varying, "salt" character varying, "registrationToken" character varying, "confirmationToken" character varying, "profileId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd"`,
    );
    await queryRunner.query(`ALTER TABLE "movie_category" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "movie_category" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "movieId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_f8a9f493199a1985d1f638a7edf" PRIMARY KEY ("id", "movieId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "movieCategoryId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_f8a9f493199a1985d1f638a7edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_bc20e43fadb75075369e834fc45" PRIMARY KEY ("id", "movieId", "movieCategoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_bc20e43fadb75075369e834fc45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_faf94ba010e630cbd922c6b6865" PRIMARY KEY ("movieId", "movieCategoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_bc20e43fadb75075369e834fc45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_faf94ba010e630cbd922c6b6865" PRIMARY KEY ("movieCategoryId", "movieId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aaf969744da05188d79735042b" ON "movie_category" ("movieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31909e0a5fc1253957393361f5" ON "movie_category" ("movieCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "FK_aaf969744da05188d79735042bf" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "FK_31909e0a5fc1253957393361f53" FOREIGN KEY ("movieCategoryId") REFERENCES "movie_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "FK_31909e0a5fc1253957393361f53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "FK_aaf969744da05188d79735042bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31909e0a5fc1253957393361f5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aaf969744da05188d79735042b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_faf94ba010e630cbd922c6b6865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_bc20e43fadb75075369e834fc45" PRIMARY KEY ("id", "movieId", "movieCategoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_faf94ba010e630cbd922c6b6865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_bc20e43fadb75075369e834fc45" PRIMARY KEY ("id", "movieId", "movieCategoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_bc20e43fadb75075369e834fc45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_f8a9f493199a1985d1f638a7edf" PRIMARY KEY ("id", "movieId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "movieCategoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_f8a9f493199a1985d1f638a7edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "movieId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "movie_category" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "movie_category" DROP CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd"`,
    );
    await queryRunner.query(`ALTER TABLE "movie_category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_category" ADD CONSTRAINT "PK_8cc157746ce57bc44cf9e356fbd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "movie_category"`);
    await queryRunner.query(`DROP TABLE "movie"`);
  }
}
