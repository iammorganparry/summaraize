-- CreateEnum
CREATE TYPE "SummaryStage" AS ENUM ('DOWNLOADING', 'TRANSCRIBING', 'EXTRACTING', 'SUMMARIZING', 'DONE');

-- CreateTable
CREATE TABLE "SummaryRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stage" "SummaryStage" NOT NULL,
    "transcription" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "summary_html" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SummaryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SummaryRequest__pgroll_new_xata_id_key" ON "SummaryRequest"("xata_id");

-- CreateIndex
CREATE INDEX "SummaryRequest_video_url_idx" ON "SummaryRequest"("video_url");

-- CreateIndex
CREATE INDEX "SummaryRequest_id_idx" ON "SummaryRequest"("id");
