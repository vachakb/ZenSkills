-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "tempuser" (
    "email" VARCHAR(100) NOT NULL,
    "created_date" TIMESTAMPTZ(6) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "temp_uid" TEXT NOT NULL,

    CONSTRAINT "tempuser_pk" PRIMARY KEY ("temp_uid")
);
