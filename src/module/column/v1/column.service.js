import prisma from "../../../utils/prisma.js";

export const createColumnV1Service = async ({ title, boardId, userId, color }) => {
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
      color,
      positionV1: lastColomn,
    },
  });
};

export const getColumnByBoardV1Service = async (boardId) => {
  return await prisma.column.findMany({
    where: {
      boardId,
    },
    orderBy: {
      positionV1: "asc",
    },
  });
};

export const deleteColumnV1Service = async (columnId, userId) => {
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

export const updateColumnV1Service = async ({
  boardId,
  columnId,
  title,
  color,
  positionBefore, // Int or null
  positionAfter,  // Int or null
  userId,
}) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!board) {
    throw new Error("Projet non trouvé ou accès refusé.");
  }

  const updateData = {};
  if (title !== undefined) {
    updateData.title = title;
  }
  if (color !== undefined) {
    updateData.color = color;
  }

  const isMoving = positionBefore !== undefined || positionAfter !== undefined;

  if (isMoving) {
    // Récupérer toutes les autres colonnes de ce board
    const boardColumns = await prisma.column.findMany({
      where: {
        boardId,
        id: { not: columnId },
      },
      orderBy: { positionV1: "asc" },
    });

    let insertIndex = boardColumns.length;
    if (positionBefore !== undefined && positionBefore !== null) {
      const idx = boardColumns.findIndex((c) => c.positionV1 === positionBefore);
      if (idx !== -1) {
        insertIndex = idx + 1;
      }
    } else if (positionAfter !== undefined && positionAfter !== null) {
      const idx = boardColumns.findIndex((c) => c.positionV1 === positionAfter);
      if (idx !== -1) {
        insertIndex = idx;
      }
    } else {
      insertIndex = 0;
    }

    boardColumns.splice(insertIndex, 0, { id: columnId });

    await prisma.$transaction(
      boardColumns.map((c, index) =>
        prisma.column.update({
          where: { id: c.id },
          data: { positionV1: index + 1 }, // 1-indexed
        })
      )
    );
  } else if (title !== undefined || color !== undefined) {
    await prisma.column.update({
      where: { id: columnId },
      data: updateData,
    });
  }

  return await prisma.column.findUnique({
    where: { id: columnId },
  });
};
