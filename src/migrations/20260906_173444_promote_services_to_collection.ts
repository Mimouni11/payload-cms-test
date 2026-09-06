import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"caption" varchar,
  	"link_label" varchar DEFAULT 'Découvrir',
  	"link_href" varchar DEFAULT '#',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_caption" varchar,
  	"version_link_label" varchar DEFAULT 'Découvrir',
  	"version_link_href" varchar DEFAULT '#',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  DROP TABLE "expertises_items" CASCADE;
  DROP TABLE "_expertises_v_version_items" CASCADE;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_image_idx" ON "_services_v" USING btree ("version_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "expertises_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"caption" varchar,
  	"link_label" varchar DEFAULT 'Découvrir',
  	"link_href" varchar DEFAULT '#'
  );
  
  CREATE TABLE "_expertises_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"caption" varchar,
  	"link_label" varchar DEFAULT 'Découvrir',
  	"link_href" varchar DEFAULT '#',
  	"_uuid" varchar
  );
  
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  ALTER TABLE "expertises_items" ADD CONSTRAINT "expertises_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expertises_items" ADD CONSTRAINT "expertises_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_expertises_v_version_items" ADD CONSTRAINT "_expertises_v_version_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertises_v_version_items" ADD CONSTRAINT "_expertises_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_expertises_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "expertises_items_order_idx" ON "expertises_items" USING btree ("_order");
  CREATE INDEX "expertises_items_parent_id_idx" ON "expertises_items" USING btree ("_parent_id");
  CREATE INDEX "expertises_items_image_idx" ON "expertises_items" USING btree ("image_id");
  CREATE INDEX "_expertises_v_version_items_order_idx" ON "_expertises_v_version_items" USING btree ("_order");
  CREATE INDEX "_expertises_v_version_items_parent_id_idx" ON "_expertises_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_expertises_v_version_items_image_idx" ON "_expertises_v_version_items" USING btree ("image_id");
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";`)
}
