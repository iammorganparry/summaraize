/*
  Warnings:

  - You are about to drop the column `embedding` on the `Summary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "embeddings" (
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "embedding" vector NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_new_embeddings_xata_id_key" ON "embeddings"("xata_id");
