import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_category" AS ENUM('multinationales', 'banques-assurances', 'industrie', 'sante');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('multinationales', 'banques-assurances', 'industrie', 'sante');
  ALTER TABLE "projects" ADD COLUMN "category" "enum_projects_category";
  ALTER TABLE "_projects_v" ADD COLUMN "version_category" "enum__projects_v_version_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "category";
  ALTER TABLE "_projects_v" DROP COLUMN "version_category";
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum__projects_v_version_category";`)
}
