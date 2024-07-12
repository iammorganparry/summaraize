/*
  Warnings:

  - Changed the type of `embedding` on the `Summary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "embedding",
ADD COLUMN     "embedding" vector(1536) NOT NULL;
