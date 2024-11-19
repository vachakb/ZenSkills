-- AlterTable
ALTER TABLE "tags" RENAME CONSTRAINT "tags_pk" TO "tags_pkey";
ALTER TABLE "tags" 
ADD COLUMN     "parent_tag_id" TEXT,
ALTER COLUMN "tag_name" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_parent_tag_id_fkey" FOREIGN KEY ("parent_tag_id") REFERENCES "tags"("tag_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "tags_unique" RENAME TO "tags_tag_name_key";
