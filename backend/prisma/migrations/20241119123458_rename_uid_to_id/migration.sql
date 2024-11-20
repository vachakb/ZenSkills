/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `mentee` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `mentor` table. All the data in the column will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `mentee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `mentor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_user_fk";

-- DropForeignKey
ALTER TABLE "mentor" DROP CONSTRAINT "mentor_user_fk";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mentee" DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mentor" DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_user_fk" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor" ADD CONSTRAINT "mentor_user_fk" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
