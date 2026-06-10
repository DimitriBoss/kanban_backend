/*
  Warnings:

  - A unique constraint covering the columns `[boardId,position]` on the table `Column` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Column_boardId_position_key" ON "Column"("boardId", "position");
