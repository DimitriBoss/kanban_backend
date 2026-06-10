import prisma from "../../../utils/prisma.js";
import { generateKeyBetween } from "fractional-indexing";

// ──────────────────────────────────────────────
// CRÉATION D'UNE TÂCHE
// ──────────────────────────────────────────────
export const createTaskV2Service = async ({
  userId,
  columnId,
  title,
  description,
  boardId,
}) => {
  // 1. Vérifier l'existence de la colonne
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { id: true, boardId: true },
  });

  if (!column) {
    return { status: "ERROR", message: "Colonne introuvable" };
  }

  // 2. Sécurité : Vérifier l'existence du board et les permissions
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { id: true, ownerId: true },
  });

  if (!board || board.ownerId !== userId) {
    return {
      status: "ERROR",
      message: "Permissions insuffisantes ou tableau introuvable",
    };
  }

  // 3. Obtenir la position de fin de la colonne
  const allTasksForPosition = await prisma.task.findMany({
    where: { columnId },
    select: { positionV2: true },
  });
  allTasksForPosition.sort((a, b) =>
    a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0,
  );
  const lastTask =
    allTasksForPosition.length > 0
      ? allTasksForPosition[allTasksForPosition.length - 1]
      : null;

  const position = lastTask
    ? generateKeyBetween(lastTask.positionV2, null)
    : generateKeyBetween(null, null);

  // 4. Créer la tâche
  const newTask = await prisma.task.create({
    data: {
      title,
      description: description || null,
      columnId,
      positionV2: position,
      creatorId: userId,
    },
  });

  return { status: "SUCCESS", task: newTask };
};

// ──────────────────────────────────────────────
// MISE À JOUR D'UNE TÂCHE (Drag & Drop complet)
// ──────────────────────────────────────────────
export const updateTaskV2Service = async ({
  taskId,
  boardId,
  columnId,
  targetColumnId,
  positionBefore,
  positionAfter,
  userId,
  title,
  description,
}) => {
  // 1. Vérifier que la tâche existe bien dans sa colonne d'origine
  const task = await prisma.task.findUnique({
    where: { id: taskId, columnId },
  });

  if (!task) {
    return {
      status: "ERROR",
      message: "Tâche introuvable dans cette colonne.",
    };
  }

  // 2. Sécurité : Vérifier les droits de l'utilisateur sur le Board
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!board) {
    return {
      status: "ERROR",
      message: "Permissions insuffisantes ou projet introuvable.",
    };
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;

  // 3. Gestion du Drag and Drop
  const isMoving =
    positionBefore !== undefined ||
    positionAfter !== undefined ||
    targetColumnId !== undefined;

  if (isMoving) {
    const finalColumnId = targetColumnId || columnId;
    updateData.columnId = finalColumnId;

    // Cas A : Changement de colonne sans voisins précis (va à la fin)
    if (
      targetColumnId &&
      targetColumnId !== columnId &&
      positionBefore === undefined &&
      positionAfter === undefined
    ) {
      const lastTask = await prisma.task.findFirst({
        where: { columnId: targetColumnId },
        orderBy: { positionV2: "desc" },
        select: { positionV2: true },
      });

      updateData.positionV2 = lastTask
        ? generateKeyBetween(lastTask.positionV2, null)
        : generateKeyBetween(null, null);
    }
    // Cas B : Placement chirurgical (interne ou croisé)
    else {
      updateData.positionV2 = generateKeyBetween(
        positionBefore || null,
        positionAfter || null,
      );
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return { status: "SUCCESS", task: updatedTask };
};

// ──────────────────────────────────────────────
// SUPPRIMER UNE TÂCHE (Sécurisée 🔒)
// ──────────────────────────────────────────────
export const deleteTaskV2Service = async ({ taskId, boardId, userId }) => {
  // 1. Sécurité : On s'assure que le demandeur est bien le propriétaire du projet
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!board) {
    return {
      status: "ERROR",
      message: "Permissions insuffisantes ou projet introuvable.",
    };
  }

  // 2. Vérifier l'existence de la tâche
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return { status: "ERROR", message: "Tâche introuvable." };
  }

  // 3. Suppression directe
  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });

  return {
    status: "SUCCESS",
    task: deletedTask,
    message: "Tâche supprimée avec succès.",
  };
};

// ──────────────────────────────────────────────
// RÉCUPÉRER LES TÂCHES D'UNE COLONNE
// ──────────────────────────────────────────────
export const getTasksByColumnIdV2Service = async ({
  columnId,
  boardId,
  userId,
}) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
  });

  if (!board) {
    return { status: "ERROR", message: "Accès refusé." };
  }

  const tasks = await prisma.task.findMany({
    where: { columnId },
  });

  // Tri JS lexicographique
  tasks.sort((a, b) =>
    a.positionV2 < b.positionV2 ? -1 : a.positionV2 > b.positionV2 ? 1 : 0,
  );

  return { status: "SUCCESS", tasks };
};
