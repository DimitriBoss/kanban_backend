import prisma from "../utils/prisma.js";

export const createBoardService = async ({ title, description, ownerId }) => {
  return await prisma.board.create({
    data: {
      title,
      description,
      ownerId,
    },
  });
};

export const getAllBoardsService = async (userId) => {
  return await prisma.board.findMany({
    where: {
      ownerId: userId,
    },
  });
};

export const deleteBoardService = async (boardId, userId) => {
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
