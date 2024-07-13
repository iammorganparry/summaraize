/*
  Warnings:

  - You are about to drop the column `embedding` on the `Summary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "embedding",
ADD COLUMN     "vector" vector;
