import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_info_details_icon" AS ENUM('location', 'phone', 'mail', 'clock');
  CREATE TYPE "public"."enum_site_info_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_info_v_version_details_icon" AS ENUM('location', 'phone', 'mail', 'clock');
  CREATE TYPE "public"."enum__site_info_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "site_info_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"icon" "enum_site_info_details_icon" DEFAULT 'location',
  	"in_footer" boolean DEFAULT true
  );
  
  CREATE TABLE "site_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"map_query" varchar,
  	"_status" "enum_site_info_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_info_v_version_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"icon" "enum__site_info_v_version_details_icon" DEFAULT 'location',
  	"in_footer" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_info_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_map_query" varchar,
  	"version__status" "enum__site_info_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  DROP TABLE "footer_contact_lines" CASCADE;
  DROP TABLE "_footer_v_version_contact_lines" CASCADE;
  ALTER TABLE "site_info_details" ADD CONSTRAINT "site_info_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_info_v_version_details" ADD CONSTRAINT "_site_info_v_version_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_info_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_info_details_order_idx" ON "site_info_details" USING btree ("_order");
  CREATE INDEX "site_info_details_parent_id_idx" ON "site_info_details" USING btree ("_parent_id");
  CREATE INDEX "site_info__status_idx" ON "site_info" USING btree ("_status");
  CREATE INDEX "_site_info_v_version_details_order_idx" ON "_site_info_v_version_details" USING btree ("_order");
  CREATE INDEX "_site_info_v_version_details_parent_id_idx" ON "_site_info_v_version_details" USING btree ("_parent_id");
  CREATE INDEX "_site_info_v_version_version__status_idx" ON "_site_info_v" USING btree ("version__status");
  CREATE INDEX "_site_info_v_created_at_idx" ON "_site_info_v" USING btree ("created_at");
  CREATE INDEX "_site_info_v_updated_at_idx" ON "_site_info_v" USING btree ("updated_at");
  CREATE INDEX "_site_info_v_latest_idx" ON "_site_info_v" USING btree ("latest");
  CREATE INDEX "_site_info_v_autosave_idx" ON "_site_info_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer_contact_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_footer_v_version_contact_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  DROP TABLE "site_info_details" CASCADE;
  DROP TABLE "site_info" CASCADE;
  DROP TABLE "_site_info_v_version_details" CASCADE;
  DROP TABLE "_site_info_v" CASCADE;
  ALTER TABLE "footer_contact_lines" ADD CONSTRAINT "footer_contact_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_contact_lines" ADD CONSTRAINT "_footer_v_version_contact_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_contact_lines_order_idx" ON "footer_contact_lines" USING btree ("_order");
  CREATE INDEX "footer_contact_lines_parent_id_idx" ON "footer_contact_lines" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_contact_lines_order_idx" ON "_footer_v_version_contact_lines" USING btree ("_order");
  CREATE INDEX "_footer_v_version_contact_lines_parent_id_idx" ON "_footer_v_version_contact_lines" USING btree ("_parent_id");
  DROP TYPE "public"."enum_site_info_details_icon";
  DROP TYPE "public"."enum_site_info_status";
  DROP TYPE "public"."enum__site_info_v_version_details_icon";
  DROP TYPE "public"."enum__site_info_v_version_status";`)
}
