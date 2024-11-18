/*
  Warnings:

  - You are about to drop the column `googleid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleid",
ADD COLUMN     "googleId" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "user_unique" ON "User"("googleId");
