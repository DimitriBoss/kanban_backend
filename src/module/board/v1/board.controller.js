import {
  createBoardV1Service,
  deleteBoardV1Service,
  getAllBoardsV1Service,
  getBoardByIdV1Service,
  updateBoardV1Service,
} from "./board.service.js";

export const createBoardV1Controller = async (req, res) => {
  try {
    const { title, description, allowDuplicate } = req.body;
    const ownerId = req.userId;
    const result = await createBoardV1Service({ title, description, ownerId, allowDuplicate });
    if (result.status === "EXIST") {
      res.status(200).json(result);
    } else {
      res.status(201).json(result.board);
    }
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

export const updateBoardV1Controller = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, allowDuplicate } = req.body;
    const userId = req.userId;

    const updatedField = {};
    if (title) updatedField.title = title;
    if (description) updatedField.description = description;

    if (Object.keys(updatedField).length === 0) {
      return res.status(400).json({ message: "Veuillez remplir les champs à modifier" });
    }

    const result = await updateBoardV1Service(boardId, userId, updatedField, allowDuplicate);
    if (result.status === "EXIST") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result.board);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
