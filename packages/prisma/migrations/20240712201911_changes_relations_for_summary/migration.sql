/*
  Warnings:

  - The primary key for the `Summary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[video_url]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[summary_id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Summary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `summary_id` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_video_url_fkey";

-- DropForeignKey
ALTER TABLE "_SummaryToUser" DROP CONSTRAINT "_SummaryToUser_A_fkey";

-- DropIndex
DROP INDEX "Video_url_key";

-- AlterTable
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "videoId" TEXT,
ADD CONSTRAINT "Summary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "summary_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Summary_video_url_key" ON "Summary"("video_url");

-- CreateIndex
CREATE UNIQUE INDEX "Video_summary_id_key" ON "Video"("summary_id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_summary_id_fkey" FOREIGN KEY ("summary_id") REFERENCES "Summary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SummaryToUser" ADD CONSTRAINT "_SummaryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
