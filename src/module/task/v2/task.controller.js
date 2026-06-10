import {
  createTaskV2Service,
  deleteTaskV2Service,
  getTasksByColumnIdV2Service,
  updateTaskV2Service,
} from "./task.service.js";

export const getTasksByColumnIdV2Controller = async (req, res) => {
  const { columnId, boardId } = req.params;
  const userId = req.userId;

  if (!columnId || !boardId) {
    return res.status(400).json({
      status: "ERROR",
      message: "Toutes les informations requises ne sont pas fournies",
    });
  }

  try {
    const result = await getTasksByColumnIdV2Service({
      columnId,
      boardId,
      userId,
    });

    if (result.status === "ERROR") {
      return res.status(400).json({ status: "ERROR", message: result.message });
    }

    res.status(200).json({
      status: "SUCCESS",
      tasks: result.tasks,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createTaskV2Controller = async (req, res) => {
  const { columnId, boardId } = req.params;
  const userId = req.userId;
  const { title, description } = req.body;

  if (!columnId || !boardId || !title) {
    return res.status(400).json({
      status: "ERROR",
      message: "Toutes les informations requises ne sont pas fournies",
    });
  }

  try {
    const result = await createTaskV2Service({
      columnId,
      boardId,
      userId,
      title,
      description,
    });

    if (result.status === "ERROR") {
      return res.status(400).json({ status: "ERROR", message: result.message });
    }

    return res.status(201).json({ status: "SUCCESS", task: result.task });
  } catch (error) {
    console.error("❌ ERREUR createTask :", error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

export const deleteTaskV2Controller = async (req, res) => {
  const { taskId, columnId, boardId } = req.params;
  const userId = req.userId;

  if (!taskId || !columnId || !boardId) {
    return res.status(400).json({
      status: "ERROR",
      message: "Toutes les informations requises ne sont pas fournies",
    });
  }

  try {
    const result = await deleteTaskV2Service({
      taskId,
      columnId,
      boardId,
      userId,
    });

    if (result.status === "ERROR") {
      return res.status(400).json({ status: "ERROR", message: result.message });
    }

    return res
      .status(200)
      .json({ status: "SUCCESS", message: result.message, task: result.task });
  } catch (error) {
    console.error("❌ ERREUR deleteTask :", error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

export const updateTaskV2Controller = async (req, res) => {
  const { taskId, columnId, boardId } = req.params;
  const userId = req.userId;
  const { title, description, targetColumnId, positionBefore, positionAfter } =
    req.body;

  if (!taskId || !columnId || !boardId) {
    return res.status(400).json({
      status: "ERROR",
      message: "Toutes les informations requises ne sont pas fournies",
    });
  }

  try {
    const result = await updateTaskV2Service({
      taskId,
      boardId,
      columnId,
      targetColumnId,
      positionBefore,
      positionAfter,
      userId,
      title,
      description,
    });

    if (result.status === "ERROR") {
      return res.status(400).json({ status: "ERROR", message: result.message });
    }

    return res
      .status(200)
      .json({ status: "SUCCESS", message: result.message, task: result.task });
  } catch (error) {
    console.error("❌ ERREUR updateTask :", error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};
