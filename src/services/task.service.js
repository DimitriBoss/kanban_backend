import prisma from "../utils/prisma.js";

export const createTaskService = async ({
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

  const lastTask = await prisma.task.count({
    where: {
      columnId,
    },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      columnId,
      position: lastTask,
      creatorId: userId,
    },
  });

  return task;
};

export const getTasksByColumnService = async (columnId) => {
  return prisma.task.findMany({
    where: {
      columnId,
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const moveTaskService = async ({
  taskId,
  newColumnId,
  newPosition,
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

  if (!task) throw new Error("Tache introuvable");

  if (task.column.board.ownerId !== userId)
    throw new Error("Vous n'etes pas le proprietaire de ce column");

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      columnId: newColumnId,
      position: newPosition,
    },
  });
};

export const deleteTaskService = async ({ taskId, boardId, userId }) => {
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

  return await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const updateTaskTitleService = async ({ taskId, boardId, title, description, userId }) => {
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

