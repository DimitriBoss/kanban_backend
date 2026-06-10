/*
  Warnings:

  - You are about to drop the column `position` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Column_boardId_position_key";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "position",
ADD COLUMN     "positionV1" INTEGER,
ADD COLUMN     "positionV2" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "position",
ADD COLUMN     "positionV1" INTEGER,
ADD COLUMN     "positionV2" TEXT;
