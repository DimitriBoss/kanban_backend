-- CreateEnum
CREATE TYPE "ColumnCategory" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "category" "ColumnCategory" NOT NULL DEFAULT 'TO_DO',
ADD COLUMN     "color" TEXT;
