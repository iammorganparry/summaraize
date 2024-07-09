/*
  Warnings:

  - The primary key for the `Summary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `video_id` on the `Summary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[xata_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `video_url` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_video_id_fkey";

-- DropIndex
DROP INDEX "Summary_id_idx";

-- DropIndex
DROP INDEX "Summary_user_id_idx";

-- DropIndex
DROP INDEX "Summary_video_id_idx";

-- AlterTable
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_pkey",
DROP COLUMN "id",
DROP COLUMN "user_id",
DROP COLUMN "video_id",
ADD COLUMN     "video_url" TEXT NOT NULL,
ADD CONSTRAINT "Summary_pkey" PRIMARY KEY ("video_url");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_SummaryToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SummaryToUser_AB_unique" ON "_SummaryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SummaryToUser_B_index" ON "_SummaryToUser"("B");

-- CreateIndex
CREATE INDEX "Summary_video_url_idx" ON "Summary"("video_url");

-- CreateIndex
CREATE UNIQUE INDEX "User__pgroll_new_xata_id_key" ON "User"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");

-- CreateIndex
CREATE INDEX "Video_url_idx" ON "Video"("url");

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_video_url_fkey" FOREIGN KEY ("video_url") REFERENCES "Video"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SummaryToUser" ADD CONSTRAINT "_SummaryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Summary"("video_url") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SummaryToUser" ADD CONSTRAINT "_SummaryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
