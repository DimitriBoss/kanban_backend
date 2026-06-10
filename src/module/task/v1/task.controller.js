import {
  createTaskV1Service,
  getTasksByColumnV1Service,
  moveTaskV1Service,
  deleteTaskV1Service,
  updateTaskTitleV1Service,
} from "./task.service.js";

export const createTaskV1Controller = async (req, res) => {
  try {
    const { title, description } = req.body;
    const columnId = req.params.columnId;
    const userId = req.userId;
    const task = await createTaskV1Service({
      title,
      description,
      columnId,
      userId,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasksByColumnV1Controller = async (req, res) => {
  try {
    const { columnId } = req.params;
    const task = await getTasksByColumnV1Service(columnId);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const moveTaskV1Controller = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newColumnId, positionBefore, positionAfter } = req.body;
    const userId = req.userId;
    const task = await moveTaskV1Service({
      taskId,
      newColumnId,
      positionBefore,
      positionAfter,
      userId,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTaskV1Controller = async (req, res) => {
  try {
    const { taskId, boardId } = req.params;
    const userId = req.userId;
    const task = await deleteTaskV1Service({ taskId, boardId, userId });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaskV1Controller = async (req, res) => {
  try {
    const { taskId, boardId } = req.params;
    const { title, description } = req.body;
    const userId = req.userId;
    const task = await updateTaskTitleV1Service({
      taskId,
      boardId,
      title,
      description,
      userId,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
