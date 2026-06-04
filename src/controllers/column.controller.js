import {
  createColumnService,
  deleteColumnService,
  getColumnByBoardService,
} from "../services/column.service.js";

export const createColumn = async (req, res) => {
  try {
    const title = req.body.title;
    const boardId = req.params.boardId;
    const userId = req.userId;
    const column = await createColumnService({ title, boardId, userId });
    res.status(201).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getColumnByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const column = await getColumnByBoardService(boardId);
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const userId = req.userId;
    const column = await deleteColumnService(columnId, userId);
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
