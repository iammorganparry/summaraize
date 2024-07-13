-- CreateTable
CREATE TABLE "SummaryEmbeds" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "summary_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector,

    CONSTRAINT "SummaryEmbeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SummaryEmbeds_summary_id_idx" ON "SummaryEmbeds"("summary_id");

-- AddForeignKey
ALTER TABLE "SummaryEmbeds" ADD CONSTRAINT "SummaryEmbeds_summary_id_fkey" FOREIGN KEY ("summary_id") REFERENCES "Summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
