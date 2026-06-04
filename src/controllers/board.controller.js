import {
  createBoardService,
  deleteBoardService,
  getAllBoardsService,
} from "../services/board.service.js";

export const createBoardController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.userId;
    const board = await createBoardService({ title, description, ownerId });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBoardsController = async (req, res) => {
  try {
    const userId = req.userId;
    const boards = await getAllBoardsService(userId);
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBoardController = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.userId;
    const board = await deleteBoardService(boardId, userId);
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
