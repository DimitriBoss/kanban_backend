import prisma from "../../../utils/prisma.js";

// ──────────────────────────────────────────────
// CRÉATION D'UNE TÂCHE
// ──────────────────────────────────────────────
export const createTaskV1Service = async ({
  title,
  description,
  columnId,
  userId,
}) => {
  const column = await prisma.column.findUnique({
    where: {
      id: columnId,
    },
    include: {
      board: true,
    },
  });

  if (!column) throw new Error("Column introuvable");

  if (column.board.ownerId !== userId)
    throw new Error("Vous n'etes pas le proprietaire de ce column");

  const lastTaskCount = await prisma.task.count({
    where: { columnId },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      columnId,
      positionV1: lastTaskCount,
      creatorId: userId,
    },
  });

  return task;
};

// ──────────────────────────────────────────────
// RÉCUPÉRER LES TÂCHES D'UNE COLONNE
// ──────────────────────────────────────────────
export const getTasksByColumnV1Service = async (columnId) => {
  return await prisma.task.findMany({
    where: { columnId },
    orderBy: { positionV1: "asc" },
  });
};

// ──────────────────────────────────────────────
// DÉPLACER UNE TÂCHE
// ──────────────────────────────────────────────
export const moveTaskV1Service = async ({
  taskId,
  newColumnId,
  positionBefore, // positionV1 (Int) du voisin du dessus
  positionAfter,  // positionV1 (Int) du voisin du dessous
  userId,
}) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { column: { include: { board: true } } },
  });

  if (!task) throw new Error("Tache introuvable");

  if (task.column.board.ownerId !== userId)
    throw new Error("Vous n'etes pas le proprietaire de ce column");

  // Récupérer toutes les autres tâches de la colonne cible
  const targetTasks = await prisma.task.findMany({
    where: {
      columnId: newColumnId,
      id: { not: taskId },
    },
    orderBy: { positionV1: "asc" },
  });

  // Déterminer où insérer la tâche
  let insertIndex = targetTasks.length; // par défaut à la fin
  if (positionBefore !== undefined && positionBefore !== null) {
    const idx = targetTasks.findIndex((t) => t.positionV1 === positionBefore);
    if (idx !== -1) {
      insertIndex = idx + 1;
    }
  } else if (positionAfter !== undefined && positionAfter !== null) {
    const idx = targetTasks.findIndex((t) => t.positionV1 === positionAfter);
    if (idx !== -1) {
      insertIndex = idx;
    }
  } else {
    insertIndex = 0;
  }

  // Insérer la tâche déplacée
  targetTasks.splice(insertIndex, 0, { id: taskId });

  // Mettre à jour séquentiellement dans une transaction
  await prisma.$transaction(
    targetTasks.map((t, index) =>
      prisma.task.update({
        where: { id: t.id },
        data: { columnId: newColumnId, positionV1: index },
      })
    )
  );

  return await prisma.task.findUnique({
    where: { id: taskId },
  });
};

// ──────────────────────────────────────────────
// SUPPRIMER UNE TÂCHE (Sécurisée 🔒)
// ──────────────────────────────────────────────
export const deleteTaskV1Service = async ({ taskId, boardId, userId }) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Tâche introuvable");
  }

  if (task.column.boardId !== boardId) {
    throw new Error("Cette tâche n'appartient pas à ce tableau");
  }

  if (task.column.board.ownerId !== userId) {
    throw new Error("Vous n'etes pas autorisé à supprimer cette tâche");
  }

  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return deletedTask;
};

// ──────────────────────────────────────────────
// MODIFIER LE TITRE D'UNE TÂCHE
// ──────────────────────────────────────────────
export const updateTaskTitleV1Service = async ({
  taskId,
  boardId,
  title,
  description,
  userId,
}) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Tâche introuvable");
  }

  if (task.column.boardId !== boardId) {
    throw new Error("Cette tâche n'appartient pas à ce tableau");
  }

  if (task.column.board.ownerId !== userId) {
    throw new Error("Vous n'etes pas autorisé à modifier cette tâche");
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;

  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data: updateData,
  });
};
