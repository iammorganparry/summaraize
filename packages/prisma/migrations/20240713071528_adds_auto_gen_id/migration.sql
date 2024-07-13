/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Summary" ALTER COLUMN "id" SET DEFAULT ('rec_'::text || (xata_private.xid())::text);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT ('rec_'::text || (xata_private.xid())::text);

-- CreateIndex
CREATE UNIQUE INDEX "Summary__pgroll_new_id_key" ON "Summary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User__pgroll_new_id_key" ON "User"("id");
