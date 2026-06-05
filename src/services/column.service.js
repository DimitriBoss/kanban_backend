import prisma from "../utils/prisma.js";

export const createColumnService = async ({ title, boardId, userId }) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });
  if (!board) {
    throw new Error("Board introuvable");
  }
  if (board.ownerId !== userId) {
    throw new Error("Vous n'etes pas le proprietaire de ce board");
  }
  const lastColomn = await prisma.column.count({
    where: {
      boardId,
    },
  });
  return await prisma.column.create({
    data: {
      title,
      boardId,
      position: lastColomn,
    },
  });
};

export const getColumnByBoardService = async (boardId) => {
  return await prisma.column.findMany({
    where: {
      boardId,
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const deleteColumnService = async (columnId, userId) => {
  const column = await prisma.column.findUnique({
    where: {
      id: columnId,
    },
    include: { board: true },
  });
  if (!column) {
    throw new Error("Column introuvable");
  }
  if (column.board.ownerId !== userId) {
    throw new Error("Vous n'etes pas le proprietaire de ce column");
  }

  // Supprimer d'abord toutes les tâches de la colonne (suppression en cascade manuelle)
  await prisma.task.deleteMany({
    where: {
      columnId: columnId,
    },
  });

  return await prisma.column.delete({
    where: {
      id: columnId,
    },
  });
};
