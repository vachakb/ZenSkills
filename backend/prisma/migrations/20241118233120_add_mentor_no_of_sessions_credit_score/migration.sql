-- AlterTable
ALTER TABLE "mentor" ADD COLUMN     "credit_score" DOUBLE PRECISION NOT NULL DEFAULT 75,
ADD COLUMN     "number_of_sessions" INTEGER NOT NULL DEFAULT 0;
