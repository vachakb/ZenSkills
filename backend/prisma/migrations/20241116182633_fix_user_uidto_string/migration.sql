/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_user_fk";

-- DropForeignKey
ALTER TABLE "mentor" DROP CONSTRAINT "mentor_user_fk";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "user_pk",
-- RENAME CONSTRAINT "user_pk" TO "User_pkey",
ALTER COLUMN "uid" DROP DEFAULT,
ALTER COLUMN "uid" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");
DROP SEQUENCE "User_uid_seq";

-- AlterTable
ALTER TABLE "mentee" ALTER COLUMN "uid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "mentor" ALTER COLUMN "uid" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_user_fk" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor" ADD CONSTRAINT "mentor_user_fk" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
