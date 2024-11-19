/*
  Warnings:

  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "mentee_interests" DROP CONSTRAINT "mentee_interests_tags_fk";

-- DropForeignKey
ALTER TABLE "mentor_expertise" DROP CONSTRAINT "mentor_expertise_tags_fk";

-- AlterTable
ALTER TABLE "mentee_interests" ALTER COLUMN "tag_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "mentor_expertise" ALTER COLUMN "tag_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pk",
ALTER COLUMN "tag_id" DROP DEFAULT,
ALTER COLUMN "tag_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tags_pk" PRIMARY KEY ("tag_id");
DROP SEQUENCE "tags_tag_id_seq";

-- AddForeignKey
ALTER TABLE "mentee_interests" ADD CONSTRAINT "mentee_interests_tags_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_expertise" ADD CONSTRAINT "mentor_expertise_tags_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
