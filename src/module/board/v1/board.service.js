import prisma from "../../../utils/prisma.js";

export const createBoardV1Service = async ({ title, description, ownerId, allowDuplicate = false }) => {
  if (!allowDuplicate) {
    const existingBoard = await prisma.board.findFirst({
      where: { title, ownerId },
    });

    if (existingBoard) {
      return {
        status: "EXIST",
        message: "Un projet avec ce nom existe déjà.",
        action: { typeA: "RENAME", typeB: "DUPLICATE" },
        board: existingBoard,
      };
    }
  }

  const newboard = await prisma.board.create({
    data: {
      title,
      description,
      ownerId,
      columns: {
        create: [
          { title: "À faire", positionV1: 1, category: "TO_DO", color: "indigo" },
          { title: "En cours", positionV1: 2, category: "IN_PROGRESS", color: "amber" },
          { title: "Terminé", positionV1: 3, category: "DONE", color: "emerald" },
        ],
      },
    },
    include: {
      columns: true,
    },
  });

  return {
    status: "SUCCESS",
    board: newboard,
  };
};

export const getAllBoardsV1Service = async (userId) => {
  return await prisma.board.findMany({
    where: {
      ownerId: userId,
    },
  });
};

export const deleteBoardV1Service = async (boardId, userId) => {
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
  return await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
};

export const getBoardByIdV1Service = async (boardId, userId) => {
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
  return board;
};

export const updateBoardV1Service = async (boardId, userId, updatedField, allowDuplicate = false) => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: boardId,
      ownerId: userId,
    },
  });

  if (!existingBoard) {
    throw new Error("Board introuvable ou accès refusé.");
  }

  const { title, description } = updatedField;

  // Si le titre change et qu'on ne force pas la duplication, on vérifie l'existence
  if (title && title !== existingBoard.title && !allowDuplicate) {
    const duplicateBoard = await prisma.board.findFirst({
      where: {
        title,
        ownerId: userId,
        NOT: {
          id: boardId,
        },
      },
    });

    if (duplicateBoard) {
      return {
        status: "EXIST",
        message: "Un projet avec ce nom existe déjà.",
        action: { typeA: "RENAME", typeB: "DUPLICATE" },
        board: duplicateBoard,
      };
    }
  }

  const updated = await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      title,
      description,
    },
  });

  return {
    status: "SUCCESS",
    board: updated,
  };
};
