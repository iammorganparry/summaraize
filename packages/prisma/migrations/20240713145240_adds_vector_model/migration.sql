/*
  Warnings:

  - The `embedding` column on the `Summary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "vectorsId" TEXT,
DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];

-- CreateTable
CREATE TABLE "Vectors" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "embedding" vector,
    "content" TEXT NOT NULL,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Vectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vectors__pgroll_new_xata_id_key" ON "Vectors"("xata_id");

-- CreateIndex
CREATE INDEX "Vectors_id_idx" ON "Vectors"("id");

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_vectorsId_fkey" FOREIGN KEY ("vectorsId") REFERENCES "Vectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vectors" ADD CONSTRAINT "Vectors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
