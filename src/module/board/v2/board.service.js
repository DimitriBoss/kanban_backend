import prisma from "../../../utils/prisma.js";
import { generateNKeysBetween } from "fractional-indexing";

export const createBoardV2Service = async ({
  title,
  description,
  ownerId,
  allowDuplicate = false,
}) => {
  // 1. Si on ne force pas la duplication, on vérifie si le nom existe
  if (!allowDuplicate) {
    const existingBoard = await prisma.board.findFirst({
      where: { title, ownerId },
      include: { columns: true }, // Utilise bien 'columns' ou 'colunms' selon ton schéma
    });

    if (existingBoard) {
      return {
        status: "EXIST",
        message: "Un projet avec ce nom existe déjà.",
        action: { typeA: "RENAME", typeB: "DUPLICATE" },
        board: existingBoard, // On renvoie le projet existant pour que le front puisse l'afficher si besoin
      };
    }
  }

  // 2. Création du projet (si le nom est libre OU si allowDuplicate est à true)
  const newboard = await prisma.board.create({
    data: {
      title,
      description,
      ownerId,
      columns: {
        create: (() => {
          // Ancienne approche (float manuel) :
          // { title: "A faire",  position: 1.0 },
          // { title: "En cours", position: 2.0 },
          // { title: "Terminé",  position: 3.0 },

          // Nouvelle approche via bibliothèque :
          // generateNKeysBetween(null, null, 3) génère 3 clés propres entre null et null
          // Ex: ["a0", "a1", "a2"]
          const [k1, k2, k3] = generateNKeysBetween(null, null, 3);
          return [
            { title: "A faire", positionV2: k1 },
            { title: "En cours", positionV2: k2 },
            { title: "Terminé", positionV2: k3 },
          ];
        })(),
      },
    },
    include: { columns: true },
  });

  return {
    status: "SUCCESS",
    board: newboard,
  };
};

export const getAllBoardsV2Service = async (userId) => {
  const allBoard = await prisma.board.findMany({
    where: { ownerId: userId },
    include: {
      columns: {
        // Ancienne approche : tri par la BDD
        // orderBy: { position: "asc" },
        // include: { tasks: { orderBy: { position: "asc" } } },

        // Nouvelle approche : on récupère tout, on trie en JS
        include: { tasks: true },
      },
    },
  });

  // Tri JS lexicographique des colonnes et des tâches pour chaque board
  const sortByPosition = (a, b) =>
    a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0;

  allBoard.forEach((board) => {
    board.columns.sort(sortByPosition);
    board.columns.forEach((col) => col.tasks.sort(sortByPosition));
  });

  return allBoard;
};

export const deleteBoardV2Service = async (boardId, userId) => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: boardId,
    },
  });

  if (!existingBoard) {
    return {
      status: "NOT_FOUND",
      message: "Le projet n'a pas été trouvé.",
    };
  }

  if (existingBoard.ownerId !== userId) {
    return {
      status: "UNAUTHORIZED",
      message: "Vous n'avez pas l'autorisation de supprimer ce projet.",
    };
  }

  const deleteBoard = await prisma.board.delete({
    where: {
      id: boardId,
    },
  });

  return deleteBoard;
};

export const updateBoardV2Service = async (boardId, userId, updatedField) => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      id: boardId,
    },
  });

  if (!existingBoard) {
    return {
      status: "NOT_FOUND",
      message: "Le projet n'a pas été trouvé.",
    };
  }

  if (existingBoard.ownerId !== userId) {
    return {
      status: "UNAUTHORIZED",
      message: "Vous n'avez pas l'autorisation de modifier ce projet.",
    };
  }

  const { title, description } = updatedField;

  const updateBoard = await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      title,
      description,
    },
  });

  return updateBoard;
};
