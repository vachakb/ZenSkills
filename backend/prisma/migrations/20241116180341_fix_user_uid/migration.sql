/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[googleid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_date` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'mentor', 'mentee');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
-- RENAME CONSTRAINT "User_pkey" TO "user_pk",
DROP COLUMN "createdAt",
DROP COLUMN "googleId",
DROP COLUMN "id",
DROP COLUMN "password",
ADD COLUMN     "created_date" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "gender" "gender_enum" NOT NULL,
ADD COLUMN     "googleid" VARCHAR,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(50) NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(13) NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "uid" BIGSERIAL NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD CONSTRAINT "user_pk" PRIMARY KEY ("uid");

-- CreateTable
CREATE TABLE "mentee" (
    "bio" TEXT,
    "mentee_id" BIGSERIAL NOT NULL,
    "uid" BIGINT NOT NULL,

    CONSTRAINT "mentee_pk" PRIMARY KEY ("mentee_id")
);

-- CreateTable
CREATE TABLE "mentee_interests" (
    "mentee_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "mentee_interests_id" BIGSERIAL NOT NULL,

    CONSTRAINT "mentee_interests_pk" PRIMARY KEY ("mentee_interests_id")
);

-- CreateTable
CREATE TABLE "mentor" (
    "bio" TEXT,
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "mentor_id" BIGSERIAL NOT NULL,
    "uid" BIGINT NOT NULL,
    "rating" REAL,
    "number_of_mentees_mentored" INTEGER NOT NULL DEFAULT 0,
    "company" VARCHAR(255),
    "mentor_job_title" VARCHAR(50) NOT NULL,

    CONSTRAINT "mentor_pk" PRIMARY KEY ("mentor_id")
);

-- CreateTable
CREATE TABLE "mentor_expertise" (
    "mentor_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "mentor_expertise_id" BIGSERIAL NOT NULL,

    CONSTRAINT "mentor_expertise_pk" PRIMARY KEY ("mentor_expertise_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_name" VARCHAR(100) NOT NULL,
    "tag_id" BIGSERIAL NOT NULL,

    CONSTRAINT "tags_pk" PRIMARY KEY ("tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_unique" ON "tags"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_unique" ON "User"("googleid");

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_user_fk" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_interests" ADD CONSTRAINT "mentee_interests_mentee_fk" FOREIGN KEY ("mentee_id") REFERENCES "mentee"("mentee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_interests" ADD CONSTRAINT "mentee_interests_tags_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor" ADD CONSTRAINT "mentor_user_fk" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_expertise" ADD CONSTRAINT "mentor_expertise_mentor_fk" FOREIGN KEY ("mentor_id") REFERENCES "mentor"("mentor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_expertise" ADD CONSTRAINT "mentor_expertise_tags_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "user_unique_1";
