/*
  Warnings:

  - You are about to drop the column `total_sessions` on the `mentee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentee" DROP COLUMN "total_sessions";

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "sessionsBooked" INTEGER NOT NULL DEFAULT 0,
    "sessionsAttended" INTEGER NOT NULL DEFAULT 0,
    "sessionsCancelled" INTEGER NOT NULL DEFAULT 0,
    "workshopsAttended" INTEGER NOT NULL DEFAULT 0,
    "badgesReceived" INTEGER NOT NULL DEFAULT 0,
    "averageAttendance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistics_uid_key" ON "statistics"("uid");

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
