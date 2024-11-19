-- DropIndex
DROP INDEX "tags_tag_name_key";

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "tag_name" DROP NOT NULL;
