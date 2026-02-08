CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" bigint NOT NULL,
	"selected_repo" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
