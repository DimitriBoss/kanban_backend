import prisma from "../../../utils/prisma.js";
import { generateKeyBetween } from "fractional-indexing";

// ─── Créer une colonne ─────────────────────────────────────────────────────
export const createColumnV2Service = async ({
  title,
  boardId,
  color,
  allowDuplicate = false,
}) => {
  // 1. Gestion des doublons de nom (Règle métier)
  if (!allowDuplicate) {
    const existingColumn = await prisma.column.findFirst({
      where: { title, boardId },
    });

    if (existingColumn) {
      return {
        status: "EXIST",
        message: "Une colonne avec ce nom existe déjà dans ce tableau.",
        action: { typeA: "RENAME", typeB: "DUPLICATE" },
        column: existingColumn,
      };
    }
  }

  // Nouvelle approche : findMany + tri JS → on prend le dernier élément
  const allColumnsForPosition = await prisma.column.findMany({
    where: { boardId },
    select: { positionV2: true },
  });
  allColumnsForPosition.sort((a, b) =>
    a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0,
  );
  const lastColumn =
    allColumnsForPosition.length > 0
      ? allColumnsForPosition[allColumnsForPosition.length - 1]
      : null;

  // Nouvelle approche via bibliothèque :
  const position = generateKeyBetween(lastColumn?.positionV2 ?? null, null);

  // 3. Création en base de données
  const newColumn = await prisma.column.create({
    data: { title, boardId, color, positionV2: position },
  });

  return { status: "SUCCESS", column: newColumn };
};

// ─── Récupérer toutes les colonnes d'un board ──────────────────────────────
export const getAllColumnsV2Service = async (boardId, userId) => {
  const existingBoard = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!existingBoard) {
    return {
      status: "NOT_FOUND",
      message: "Le projet n'a pas été trouvé.",
    };
  }

  // 1. On récupère les colonnes sans le tri de la BDD
  const allColumns = await prisma.column.findMany({
    where: { boardId },
    include: { tasks: true },
  });

  // 2. On trie les colonnes avec le tri JS
  allColumns.sort((a, b) =>
    a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0,
  );

  // 3. On trie aussi les tâches à l'intérieur de chaque colonne
  allColumns.forEach((col) => {
    col.tasks.sort((a, b) =>
      a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0,
    );
  });

  return { status: "SUCCESS", columns: allColumns };
};

// ─── Supprimer une colonne ─────────────────────────────────────────────────
export const deleteColumnV2Service = async (boardId, columnId, userId) => {
  // 1. Vérification de sécurité
  const existingBoard = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!existingBoard) {
    return { status: "NOT_FOUND", message: "Le projet n'a pas été trouvé." };
  }

  // 2. Vérification de la colonne
  const existingColumn = await prisma.column.findFirst({
    where: { id: columnId, boardId },
  });

  if (!existingColumn) {
    return { status: "NOT_FOUND", message: "La colonne n'a pas été trouvée." };
  }

  // 3. Suppression
  const deletedColumn = await prisma.column.delete({
    where: { id: columnId },
  });

  return { status: "SUCCESS", column: deletedColumn };
};

// ─── Mettre à jour une colonne (titre et/ou position) ─────────────────────
export const updateColumnV2Service = async ({
  boardId,
  columnId,
  title,
  color,
  positionBefore, // String ou null
  positionAfter,  // String ou null
  userId,
  allowDuplicate = false,
}) => {
  // 1. Sécurité : Vérification des droits sur le tableau
  const existingBoard = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!existingBoard) {
    return {
      status: "NOT_FOUND",
      message: "Projet non trouvé ou accès refusé.",
    };
  }

  const updateData = {};

  if (color !== undefined) {
    updateData.color = color;
  }

  // 2. Gestion du Titre & Doublons
  if (title !== undefined) {
    if (!allowDuplicate) {
      const duplicateColumn = await prisma.column.findFirst({
        where: { boardId, title, id: { not: columnId } },
      });

      if (duplicateColumn) {
        return {
          status: "EXIST",
          message: "Une autre colonne avec ce nom existe déjà.",
          action: { typeA: "RENAME", typeB: "DUPLICATE" },
          column: duplicateColumn,
        };
      }
    }
    updateData.title = title;
  }

  // 3. Gestion du Drag & Drop
  const isMoving = positionBefore !== undefined || positionAfter !== undefined;

  if (isMoving) {
    const newPosition = generateKeyBetween(
      positionBefore ?? null,
      positionAfter ?? null,
    );

    updateData.positionV2 = newPosition;
  }

  // 4. On applique les changements
  const updatedColumn = await prisma.column.update({
    where: { id: columnId },
    data: updateData,
  });

  return { status: "SUCCESS", column: updatedColumn };
};
