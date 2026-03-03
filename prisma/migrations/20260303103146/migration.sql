/*
  Warnings:

  - The `allowedFileTypes` column on the `packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AllowedFileTypes" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'DOCUMENT');

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "allowedFileTypes",
ADD COLUMN     "allowedFileTypes" "AllowedFileTypes"[];

-- DropEnum
DROP TYPE "allowedFileTypes";
