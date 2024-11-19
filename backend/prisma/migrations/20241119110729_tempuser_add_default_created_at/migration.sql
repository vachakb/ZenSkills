/*
  Warnings:

  - You are about to drop the column `created_date` on the `tempuser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tempuser" DROP COLUMN "created_date",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
