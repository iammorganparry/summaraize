/*
  Warnings:

  - You are about to drop the column `summary` on the `SummaryRequest` table. All the data in the column will be lost.
  - You are about to drop the column `summary_html` on the `SummaryRequest` table. All the data in the column will be lost.
  - You are about to drop the column `transcription` on the `SummaryRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SummaryRequest" DROP COLUMN "summary",
DROP COLUMN "summary_html",
DROP COLUMN "transcription",
ALTER COLUMN "stage" SET DEFAULT 'DOWNLOADING';
