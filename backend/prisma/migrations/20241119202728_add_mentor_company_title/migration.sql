-- AlterTable
ALTER TABLE "mentee" ADD COLUMN     "company" VARCHAR(255),
ADD COLUMN     "mentee_title" VARCHAR(50) NOT NULL DEFAULT '';
