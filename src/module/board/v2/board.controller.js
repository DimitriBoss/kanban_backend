import {
  createBoardV2Service,
  deleteBoardV2Service,
  getAllBoardsV2Service,
  updateBoardV2Service,
} from "./board.service.js";

export const createBoardV2Controller = async (req, res) => {
  const { title, description } = req.body;
  const ownerId = req.userId;

  if (!title || !ownerId) {
    return res.status(401).json({ message: "veillez remplir les champs" });
  }

  try {
    const board = await createBoardV2Service({ title, description, ownerId });
    if (board.status === "EXIST") {
      res.status(200).json({ ...board });
    } else {
      res.status(201).json({ board });
    }
  } catch (error) {
    console.error("❌ ERREUR createBoard :", error);
    res.status(401).json({ message: "erreur de creation de projet", detail: error.message });
  }
};

export const getAllBoardsV2Controller = async (req, res) => {
  const userId = req.userId;

  try {
    const allBaord = await getAllBoardsV2Service(userId);
    res.status(200).json({ allBaord });
  } catch (error) {
    res.status(400).json({ message: "erreur de chargement des projet" });
  }
};

export const deleteBoardV2Controller = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.userId;

  try {
    const board = await deleteBoardV2Service(boardId, userId);
    if (board.status === "NOT_FOUND" || board.status === "UNAUTHORIZED") {
      res.status(400).json({ ...board });
    } else {
      res.status(200).json({ board });
    }
  } catch (error) {
    res.status(400).json({ message: "erreur de suppression du projet" });
  }
};

export const updateBoardV2Controller = async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;
  const userId = req.userId;

  const updatedField = {};
  if (title) updatedField.title = title;
  if (description) updatedField.description = description;

  if (Object.keys(updatedField).length === 0) {
    return res.status(401).json({ message: "veillez remplir les champs" });
  }

  try {
    const board = await updateBoardV2Service(boardId, userId, updatedField);
    if (board.status === "NOT_FOUND" || board.status === "UNAUTHORIZED") {
      res.status(400).json({ ...board });
    } else {
      res.status(200).json({ board });
    }
  } catch (error) {
    res.status(400).json({ message: "erreur de modification du projet" });
  }
};
