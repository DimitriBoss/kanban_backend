import {
  createColumnV1Service,
  deleteColumnV1Service,
  getColumnByBoardV1Service,
  updateColumnV1Service,
} from "./column.service.js";

export const createColumnV1Controller = async (req, res) => {
  try {
    const title = req.body.title;
    const color = req.body.color;
    const boardId = req.params.boardId;
    const userId = req.userId;
    const column = await createColumnV1Service({ title, boardId, userId, color });
    res.status(201).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getColumnByBoardV1Controller = async (req, res) => {
  try {
    const { boardId } = req.params;
    const column = await getColumnByBoardV1Service(boardId);
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteColumnV1Controller = async (req, res) => {
  try {
    const { columnId } = req.params;
    const userId = req.userId;
    const column = await deleteColumnV1Service(columnId, userId);
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateColumnV1Controller = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { title, color, positionBefore, positionAfter } = req.body;
    const userId = req.userId;

    const column = await updateColumnV1Service({
      boardId,
      columnId,
      title,
      color,
      positionBefore,
      positionAfter,
      userId,
    });
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
