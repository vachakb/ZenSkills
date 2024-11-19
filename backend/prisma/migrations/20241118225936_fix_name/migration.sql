/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `mentee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `mentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "mentee" ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "mentor" ADD COLUMN     "name" VARCHAR(50) NOT NULL;
