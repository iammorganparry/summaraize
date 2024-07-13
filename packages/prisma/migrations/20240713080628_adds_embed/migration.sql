/*
  Warnings:

  - You are about to drop the column `vector` on the `Summary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "vector",
ADD COLUMN     "embedding" vector;
