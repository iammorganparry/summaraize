/*
  Warnings:

  - A unique constraint covering the columns `[xata_id]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xata_id]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xata_id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Author__pgroll_new_xata_id_key" ON "Author"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "Summary__pgroll_new_xata_id_key" ON "Summary"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "Video__pgroll_new_xata_id_key" ON "Video"("xata_id");
