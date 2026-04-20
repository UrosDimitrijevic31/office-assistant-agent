CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved');--> statement-breakpoint
CREATE TYPE "public"."tool_type" AS ENUM('get_current_datetime', 'schedule_meeting', 'send_email', 'create_ticket');--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "tool_type" NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "approval_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
