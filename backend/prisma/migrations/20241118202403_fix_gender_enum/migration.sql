/*
  Warnings:

  - The values [male,female,other,prefer_not_to_say] on the enum `gender_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "gender_enum_new" AS ENUM ('Male', 'Female', 'Other', 'Prefer_not_to_say');
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "gender_enum_new" USING ("gender"::text::"gender_enum_new");
ALTER TYPE "gender_enum" RENAME TO "gender_enum_old";
ALTER TYPE "gender_enum_new" RENAME TO "gender_enum";
DROP TYPE "gender_enum_old";
COMMIT;
