/*
  Warnings:

  - The `allowedFileTypes` column on the `packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `originalName` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "allowedFileTypes" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'DOCUMENT');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "originalName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "allowedFileTypes",
ADD COLUMN     "allowedFileTypes" "allowedFileTypes"[];
