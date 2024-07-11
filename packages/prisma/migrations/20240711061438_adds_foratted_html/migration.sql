/*
  Warnings:

  - Added the required column `summary_html_formatted` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "summary_html_formatted" TEXT NOT NULL;
