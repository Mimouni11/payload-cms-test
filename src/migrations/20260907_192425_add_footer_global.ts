import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_socials_platform" AS ENUM('facebook', 'instagram', 'x', 'linkedin');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_socials_platform" AS ENUM('facebook', 'instagram', 'x', 'linkedin');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_socials_platform",
  	"url" varchar
  );
  
  CREATE TABLE "footer_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_contact_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar DEFAULT 'Spécialiste tunisien de l’espace professionnel. Conception, fourniture et réalisation sous un même toit depuis 2008.',
  	"nav_title" varchar DEFAULT 'Navigation',
  	"services_title" varchar DEFAULT 'Nos métiers',
  	"contact_title" varchar DEFAULT 'Contact',
  	"legal" varchar DEFAULT 'Crafted by BigArt | 2026',
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__footer_v_version_socials_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_contact_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_tagline" varchar DEFAULT 'Spécialiste tunisien de l’espace professionnel. Conception, fourniture et réalisation sous un même toit depuis 2008.',
  	"version_nav_title" varchar DEFAULT 'Navigation',
  	"version_services_title" varchar DEFAULT 'Nos métiers',
  	"version_contact_title" varchar DEFAULT 'Contact',
  	"version_legal" varchar DEFAULT 'Crafted by BigArt | 2026',
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_links" ADD CONSTRAINT "footer_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_lines" ADD CONSTRAINT "footer_contact_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_socials" ADD CONSTRAINT "_footer_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_nav_links" ADD CONSTRAINT "_footer_v_version_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_contact_lines" ADD CONSTRAINT "_footer_v_version_contact_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_links_order_idx" ON "footer_nav_links" USING btree ("_order");
  CREATE INDEX "footer_nav_links_parent_id_idx" ON "footer_nav_links" USING btree ("_parent_id");
  CREATE INDEX "footer_contact_lines_order_idx" ON "footer_contact_lines" USING btree ("_order");
  CREATE INDEX "footer_contact_lines_parent_id_idx" ON "footer_contact_lines" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "_footer_v_version_socials_order_idx" ON "_footer_v_version_socials" USING btree ("_order");
  CREATE INDEX "_footer_v_version_socials_parent_id_idx" ON "_footer_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_nav_links_order_idx" ON "_footer_v_version_nav_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_nav_links_parent_id_idx" ON "_footer_v_version_nav_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_contact_lines_order_idx" ON "_footer_v_version_contact_lines" USING btree ("_order");
  CREATE INDEX "_footer_v_version_contact_lines_parent_id_idx" ON "_footer_v_version_contact_lines" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer_nav_links" CASCADE;
  DROP TABLE "footer_contact_lines" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_socials" CASCADE;
  DROP TABLE "_footer_v_version_nav_links" CASCADE;
  DROP TABLE "_footer_v_version_contact_lines" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TYPE "public"."enum_footer_socials_platform";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_socials_platform";
  DROP TYPE "public"."enum__footer_v_version_status";`)
}
