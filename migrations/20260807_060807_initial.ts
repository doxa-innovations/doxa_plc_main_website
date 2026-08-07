import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_project_type" AS ENUM('Website', 'E-Commerce', 'Custom Software', 'Mobile App', 'Branding', 'Maintenance', 'Other');
  CREATE TYPE "public"."enum_leads_budget" AS ENUM('Under $2,000', '$2,000 – $5,000', '$5,000 – $10,000', '$10,000+', 'Not sure yet');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  CREATE TYPE "public"."enum_leads_first_touch_channel" AS ENUM('Paid Search', 'Paid Social', 'Organic Search', 'Organic Social', 'Email', 'Referral', 'Direct');
  CREATE TYPE "public"."enum_leads_last_touch_channel" AS ENUM('Paid Search', 'Paid Social', 'Organic Search', 'Organic Social', 'Email', 'Referral', 'Direct');
  CREATE TYPE "public"."enum_visits_channel" AS ENUM('Paid Search', 'Paid Social', 'Organic Search', 'Organic Social', 'Email', 'Referral', 'Direct');
  CREATE TYPE "public"."enum_visits_device_class" AS ENUM('desktop', 'mobile', 'tablet', 'bot');
  CREATE TYPE "public"."enum_consent_events_action" AS ENUM('accept-all', 'reject-all', 'custom', 'withdrawn');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('live', 'in-development');
  CREATE TYPE "public"."enum_pricing_tiers_mode" AS ENUM('from', 'quote');
  CREATE TYPE "public"."enum_add_ons_interval" AS ENUM('month', 'once');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"country" varchar,
  	"project_type" "enum_leads_project_type",
  	"budget" "enum_leads_budget",
  	"message" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"notes" varchar,
  	"visitor_hash" varchar,
  	"visitor_id" varchar,
  	"first_touch_channel" "enum_leads_first_touch_channel",
  	"first_touch_utm_source" varchar,
  	"first_touch_utm_medium" varchar,
  	"first_touch_utm_campaign" varchar,
  	"first_touch_utm_term" varchar,
  	"first_touch_utm_content" varchar,
  	"first_touch_gclid" varchar,
  	"first_touch_fbclid" varchar,
  	"first_touch_msclkid" varchar,
  	"first_touch_ttclid" varchar,
  	"first_touch_li_fat_id" varchar,
  	"first_touch_referrer" varchar,
  	"first_touch_referrer_host" varchar,
  	"first_touch_landing_path" varchar,
  	"last_touch_channel" "enum_leads_last_touch_channel",
  	"last_touch_utm_source" varchar,
  	"last_touch_utm_medium" varchar,
  	"last_touch_utm_campaign" varchar,
  	"last_touch_utm_term" varchar,
  	"last_touch_utm_content" varchar,
  	"last_touch_gclid" varchar,
  	"last_touch_fbclid" varchar,
  	"last_touch_msclkid" varchar,
  	"last_touch_ttclid" varchar,
  	"last_touch_li_fat_id" varchar,
  	"last_touch_referrer" varchar,
  	"last_touch_referrer_host" varchar,
  	"last_touch_landing_path" varchar,
  	"geo_country" varchar,
  	"notification_sent" boolean DEFAULT false,
  	"confirmation_sent" boolean DEFAULT false,
  	"delivery_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_hash" varchar NOT NULL,
  	"visitor_id" varchar,
  	"channel" "enum_visits_channel",
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"gclid" varchar,
  	"fbclid" varchar,
  	"msclkid" varchar,
  	"ttclid" varchar,
  	"li_fat_id" varchar,
  	"referrer" varchar,
  	"referrer_host" varchar,
  	"landing_path" varchar,
  	"country" varchar,
  	"device_class" "enum_visits_device_class",
  	"consented" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consent_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_hash" varchar NOT NULL,
  	"visitor_id" varchar,
  	"analytics" boolean DEFAULT false,
  	"marketing" boolean DEFAULT false,
  	"policy_version" varchar NOT NULL,
  	"action" "enum_consent_events_action" NOT NULL,
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "team_members_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"photo" varchar NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_approach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "projects_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"country_code" varchar NOT NULL,
  	"industry" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"problem" varchar NOT NULL,
  	"what_we_built" varchar NOT NULL,
  	"testimonial_quote" varchar,
  	"testimonial_name" varchar,
  	"testimonial_role" varchar,
  	"live_url" varchar,
  	"logo" varchar NOT NULL,
  	"cover_image" varchar NOT NULL,
  	"recommendation_url" varchar,
  	"featured" boolean DEFAULT false,
  	"status" "enum_projects_status" DEFAULT 'live' NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pricing_tiers_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pricing_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"best_for" varchar NOT NULL,
  	"mode" "enum_pricing_tiers_mode" DEFAULT 'from' NOT NULL,
  	"amount_usd" numeric,
  	"amount_etb" numeric,
  	"timeline" varchar NOT NULL,
  	"payment" varchar NOT NULL,
  	"highlighted" boolean DEFAULT false,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "add_ons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"detail" varchar NOT NULL,
  	"amount_usd" numeric NOT NULL,
  	"interval" "enum_add_ons_interval" DEFAULT 'month' NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"leads_id" integer,
  	"visits_id" integer,
  	"consent_events_id" integer,
  	"team_members_id" integer,
  	"projects_id" integer,
  	"pricing_tiers_id" integer,
  	"add_ons_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"phone2" varchar,
  	"whatsapp" varchar NOT NULL,
  	"telegram" varchar NOT NULL,
  	"street" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"region" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"country_code" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"map_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_expertise" ADD CONSTRAINT "team_members_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_social" ADD CONSTRAINT "team_members_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_approach" ADD CONSTRAINT "projects_approach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tech_stack" ADD CONSTRAINT "projects_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_tiers_includes" ADD CONSTRAINT "pricing_tiers_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visits_fk" FOREIGN KEY ("visits_id") REFERENCES "public"."visits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_events_fk" FOREIGN KEY ("consent_events_id") REFERENCES "public"."consent_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_tiers_fk" FOREIGN KEY ("pricing_tiers_id") REFERENCES "public"."pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_add_ons_fk" FOREIGN KEY ("add_ons_id") REFERENCES "public"."add_ons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");
  CREATE INDEX "leads_project_type_idx" ON "leads" USING btree ("project_type");
  CREATE INDEX "leads_budget_idx" ON "leads" USING btree ("budget");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_visitor_hash_idx" ON "leads" USING btree ("visitor_hash");
  CREATE INDEX "leads_visitor_id_idx" ON "leads" USING btree ("visitor_id");
  CREATE INDEX "leads_first_touch_first_touch_channel_idx" ON "leads" USING btree ("first_touch_channel");
  CREATE INDEX "leads_first_touch_first_touch_utm_source_idx" ON "leads" USING btree ("first_touch_utm_source");
  CREATE INDEX "leads_first_touch_first_touch_utm_campaign_idx" ON "leads" USING btree ("first_touch_utm_campaign");
  CREATE INDEX "leads_first_touch_first_touch_referrer_host_idx" ON "leads" USING btree ("first_touch_referrer_host");
  CREATE INDEX "leads_last_touch_last_touch_channel_idx" ON "leads" USING btree ("last_touch_channel");
  CREATE INDEX "leads_last_touch_last_touch_utm_source_idx" ON "leads" USING btree ("last_touch_utm_source");
  CREATE INDEX "leads_last_touch_last_touch_utm_campaign_idx" ON "leads" USING btree ("last_touch_utm_campaign");
  CREATE INDEX "leads_last_touch_last_touch_referrer_host_idx" ON "leads" USING btree ("last_touch_referrer_host");
  CREATE INDEX "leads_geo_country_idx" ON "leads" USING btree ("geo_country");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "visits_visitor_hash_idx" ON "visits" USING btree ("visitor_hash");
  CREATE INDEX "visits_visitor_id_idx" ON "visits" USING btree ("visitor_id");
  CREATE INDEX "visits_channel_idx" ON "visits" USING btree ("channel");
  CREATE INDEX "visits_utm_source_idx" ON "visits" USING btree ("utm_source");
  CREATE INDEX "visits_utm_campaign_idx" ON "visits" USING btree ("utm_campaign");
  CREATE INDEX "visits_referrer_host_idx" ON "visits" USING btree ("referrer_host");
  CREATE INDEX "visits_country_idx" ON "visits" USING btree ("country");
  CREATE INDEX "visits_device_class_idx" ON "visits" USING btree ("device_class");
  CREATE INDEX "visits_updated_at_idx" ON "visits" USING btree ("updated_at");
  CREATE INDEX "visits_created_at_idx" ON "visits" USING btree ("created_at");
  CREATE INDEX "consent_events_visitor_hash_idx" ON "consent_events" USING btree ("visitor_hash");
  CREATE INDEX "consent_events_visitor_id_idx" ON "consent_events" USING btree ("visitor_id");
  CREATE INDEX "consent_events_policy_version_idx" ON "consent_events" USING btree ("policy_version");
  CREATE INDEX "consent_events_country_idx" ON "consent_events" USING btree ("country");
  CREATE INDEX "consent_events_updated_at_idx" ON "consent_events" USING btree ("updated_at");
  CREATE INDEX "consent_events_created_at_idx" ON "consent_events" USING btree ("created_at");
  CREATE INDEX "team_members_expertise_order_idx" ON "team_members_expertise" USING btree ("_order");
  CREATE INDEX "team_members_expertise_parent_id_idx" ON "team_members_expertise" USING btree ("_parent_id");
  CREATE INDEX "team_members_social_order_idx" ON "team_members_social" USING btree ("_order");
  CREATE INDEX "team_members_social_parent_id_idx" ON "team_members_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "projects_approach_order_idx" ON "projects_approach" USING btree ("_order");
  CREATE INDEX "projects_approach_parent_id_idx" ON "projects_approach" USING btree ("_parent_id");
  CREATE INDEX "projects_tech_stack_order_idx" ON "projects_tech_stack" USING btree ("_order");
  CREATE INDEX "projects_tech_stack_parent_id_idx" ON "projects_tech_stack" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "pricing_tiers_includes_order_idx" ON "pricing_tiers_includes" USING btree ("_order");
  CREATE INDEX "pricing_tiers_includes_parent_id_idx" ON "pricing_tiers_includes" USING btree ("_parent_id");
  CREATE INDEX "pricing_tiers_updated_at_idx" ON "pricing_tiers" USING btree ("updated_at");
  CREATE INDEX "pricing_tiers_created_at_idx" ON "pricing_tiers" USING btree ("created_at");
  CREATE INDEX "add_ons_updated_at_idx" ON "add_ons" USING btree ("updated_at");
  CREATE INDEX "add_ons_created_at_idx" ON "add_ons" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("visits_id");
  CREATE INDEX "payload_locked_documents_rels_consent_events_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_events_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_tiers_id");
  CREATE INDEX "payload_locked_documents_rels_add_ons_id_idx" ON "payload_locked_documents_rels" USING btree ("add_ons_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "visits" CASCADE;
  DROP TABLE "consent_events" CASCADE;
  DROP TABLE "team_members_expertise" CASCADE;
  DROP TABLE "team_members_social" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "projects_approach" CASCADE;
  DROP TABLE "projects_tech_stack" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "pricing_tiers_includes" CASCADE;
  DROP TABLE "pricing_tiers" CASCADE;
  DROP TABLE "add_ons" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_leads_project_type";
  DROP TYPE "public"."enum_leads_budget";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_first_touch_channel";
  DROP TYPE "public"."enum_leads_last_touch_channel";
  DROP TYPE "public"."enum_visits_channel";
  DROP TYPE "public"."enum_visits_device_class";
  DROP TYPE "public"."enum_consent_events_action";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_pricing_tiers_mode";
  DROP TYPE "public"."enum_add_ons_interval";`)
}
