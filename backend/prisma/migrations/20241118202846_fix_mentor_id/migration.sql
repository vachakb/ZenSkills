/*
  Warnings:

  - The primary key for the `mentor_expertise` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "mentor_expertise" DROP CONSTRAINT "mentor_expertise_pk",
ALTER COLUMN "mentor_expertise_id" DROP DEFAULT,
ALTER COLUMN "mentor_expertise_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mentor_expertise_pk" PRIMARY KEY ("mentor_expertise_id");
DROP SEQUENCE "mentor_expertise_mentor_expertise_id_seq";
