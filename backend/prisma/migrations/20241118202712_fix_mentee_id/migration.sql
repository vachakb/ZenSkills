/*
  Warnings:

  - The primary key for the `mentee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mentee_interests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "mentee_interests" DROP CONSTRAINT "mentee_interests_mentee_fk";

-- AlterTable
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_pk",
ALTER COLUMN "mentee_id" DROP DEFAULT,
ALTER COLUMN "mentee_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mentee_pk" PRIMARY KEY ("mentee_id");
DROP SEQUENCE "mentee_mentee_id_seq";

-- AlterTable
ALTER TABLE "mentee_interests" DROP CONSTRAINT "mentee_interests_pk",
ALTER COLUMN "mentee_id" SET DATA TYPE TEXT,
ALTER COLUMN "mentee_interests_id" DROP DEFAULT,
ALTER COLUMN "mentee_interests_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mentee_interests_pk" PRIMARY KEY ("mentee_interests_id");
DROP SEQUENCE "mentee_interests_mentee_interests_id_seq";

-- AddForeignKey
ALTER TABLE "mentee_interests" ADD CONSTRAINT "mentee_interests_mentee_fk" FOREIGN KEY ("mentee_id") REFERENCES "mentee"("mentee_id") ON DELETE CASCADE ON UPDATE CASCADE;
