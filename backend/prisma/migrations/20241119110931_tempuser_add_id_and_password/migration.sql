/*
  Warnings:

  - The primary key for the `tempuser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password_hash` on the `tempuser` table. All the data in the column will be lost.
  - You are about to drop the column `temp_uid` on the `tempuser` table. All the data in the column will be lost.
  - The required column `id` was added to the `tempuser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `tempuser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tempuser" DROP CONSTRAINT "tempuser_pk",
DROP COLUMN "password_hash",
DROP COLUMN "temp_uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD CONSTRAINT "tempuser_pk" PRIMARY KEY ("id");
