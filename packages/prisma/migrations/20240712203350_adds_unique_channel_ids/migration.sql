/*
  Warnings:

  - A unique constraint covering the columns `[channel_url]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Author_channel_url_key" ON "Author"("channel_url");
