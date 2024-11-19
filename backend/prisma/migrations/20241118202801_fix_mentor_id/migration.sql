/*
  Warnings:

  - The primary key for the `mentor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "mentor_expertise" DROP CONSTRAINT "mentor_expertise_mentor_fk";

-- AlterTable
ALTER TABLE "mentor" DROP CONSTRAINT "mentor_pk",
ALTER COLUMN "mentor_id" DROP DEFAULT,
ALTER COLUMN "mentor_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mentor_pk" PRIMARY KEY ("mentor_id");
DROP SEQUENCE "mentor_mentor_id_seq";

-- AlterTable
ALTER TABLE "mentor_expertise" ALTER COLUMN "mentor_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "mentor_expertise" ADD CONSTRAINT "mentor_expertise_mentor_fk" FOREIGN KEY ("mentor_id") REFERENCES "mentor"("mentor_id") ON DELETE CASCADE ON UPDATE CASCADE;
