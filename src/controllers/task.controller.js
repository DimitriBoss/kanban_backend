import {
  createTaskService,
  getTasksByColumnService,
  moveTaskService,
} from "../services/task.service.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const columnId = req.params.columnId;
    const userId = req.userId;
    const task = await createTaskService({
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

export const getTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const task = await getTasksByColumnService(columnId);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newColumnId, newPosition } = req.body;
    const userId = req.userId;
    const task = await moveTaskService({
      taskId,
      newColumnId,
      newPosition,
      userId,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
