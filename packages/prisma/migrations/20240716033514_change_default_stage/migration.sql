-- AlterEnum
ALTER TYPE "SummaryStage" ADD VALUE 'QUEUED';

-- AlterTable
ALTER TABLE "SummaryRequest" ALTER COLUMN "stage" SET DEFAULT 'QUEUED';
