import {
  createBoardV1Service,
  deleteBoardV1Service,
  getAllBoardsV1Service,
  getBoardByIdV1Service,
} from "./board.service.js";

export const createBoardV1Controller = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.userId;
    const board = await createBoardV1Service({ title, description, ownerId });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBoardsV1Controller = async (req, res) => {
  try {
    const userId = req.userId;
    const boards = await getAllBoardsV1Service(userId);
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBoardV1Controller = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.userId;
    const board = await deleteBoardV1Service(boardId, userId);
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBoardByIdV1Controller = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.userId;
    const board = await getBoardByIdV1Service(boardId, userId);
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

