/*
  Warnings:

  - You are about to drop the column `videoId` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `summary_id` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_summary_id_fkey";

-- DropIndex
DROP INDEX "Video_summary_id_key";

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "videoId",
ADD COLUMN     "video_id" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "summary_id";

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
