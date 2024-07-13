/*
  Warnings:

  - You are about to drop the `_SummaryToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `embeddings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SummaryToUser" DROP CONSTRAINT "_SummaryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SummaryToUser" DROP CONSTRAINT "_SummaryToUser_B_fkey";

-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "embedding" REAL[],
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_SummaryToUser";

-- DropTable
DROP TABLE "embeddings";

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
