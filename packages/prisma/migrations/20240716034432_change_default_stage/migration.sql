-- AlterEnum
ALTER TYPE "SummaryStage" ADD VALUE 'QUEUED';
COMMIT;
-- AlterTable
ALTER TABLE "SummaryRequest" ALTER COLUMN "stage" SET DEFAULT 'QUEUED';
