-- CreateEnum
CREATE TYPE "SummaryStage" AS ENUM ('DOWNLOADING', 'TRANSCRIBING', 'EXTRACTING', 'SUMMARIZING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "data_raw" JSONB NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "views" TEXT,
    "likes" INTEGER,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "video_id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "channel_url" TEXT NOT NULL,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "transcription" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "summary_html_formatted" TEXT NOT NULL,
    "id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "user_id" TEXT NOT NULL,
    "video_id" TEXT,
    "embedding" vector(1536),

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stage" "SummaryStage" NOT NULL DEFAULT 'DOWNLOADING',
    "video_url" TEXT NOT NULL,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "SummaryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User__pgroll_new_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User__pgroll_new_xata_id_key" ON "User"("xata_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Video__pgroll_new_xata_id_key" ON "Video"("xata_id");

-- CreateIndex
CREATE INDEX "Video_url_idx" ON "Video"("url");

-- CreateIndex
CREATE INDEX "Video_user_id_idx" ON "Video"("user_id");

-- CreateIndex
CREATE INDEX "Video_id_idx" ON "Video"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Author_channel_url_key" ON "Author"("channel_url");

-- CreateIndex
CREATE UNIQUE INDEX "Author__pgroll_new_xata_id_key" ON "Author"("xata_id");

-- CreateIndex
CREATE INDEX "Author_video_id_idx" ON "Author"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_video_url_key" ON "Summary"("video_url");

-- CreateIndex
CREATE UNIQUE INDEX "Summary__pgroll_new_xata_id_key" ON "Summary"("xata_id");

-- CreateIndex
CREATE UNIQUE INDEX "Summary__pgroll_new_id_key" ON "Summary"("id");

-- CreateIndex
CREATE INDEX "Summary_name_idx" ON "Summary"("name");

-- CreateIndex
CREATE INDEX "Summary_video_url_idx" ON "Summary"("video_url");

-- CreateIndex
CREATE UNIQUE INDEX "SummaryRequest__pgroll_new_xata_id_key" ON "SummaryRequest"("xata_id");

-- CreateIndex
CREATE INDEX "SummaryRequest_video_url_idx" ON "SummaryRequest"("video_url");

-- CreateIndex
CREATE INDEX "SummaryRequest_id_idx" ON "SummaryRequest"("id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryRequest" ADD CONSTRAINT "SummaryRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
