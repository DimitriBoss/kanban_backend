import {
  createColumnV2Service,
  deleteColumnV2Service,
  getAllColumnsV2Service,
  updateColumnV2Service,
} from "./column.service.js";

export const createColumnV2Controller = async (req, res) => {
  const { title, allowDuplicate } = req.body;
  const { boardId } = req.params;

  if (!title) {
    return res.status(400).json({
      status: 400,
      message: "Le titre de la colonne est requis.",
    });
  }

  if (!boardId) {
    return res.status(400).json({
      status: 400,
      message: "Le boardId est requis.",
    });
  }

  try {
    const result = await createColumnV2Service({
      title,
      boardId,
      allowDuplicate,
    });

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        status: 200,
        message: "Colonne créée avec succès.",
        column: result.column,
      });
    }

    if (result.status === "EXIST") {
      return res.status(200).json({
        status: 200,
        message: result.message,
        action: result.action,
        column: result.column,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur",
    });
  }
};

export const getAllColumnsV2Controller = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.userId;

  if (!boardId) {
    return res.status(400).json({
      status: 400,
      message: "Le boardId est requis.",
    });
  }

  try {
    const result = await getAllColumnsV2Service(boardId, userId);

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        status: 200,
        message: "Colonne récupérées avec succès.",
        columns: result.columns,
      });
    }

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        status: 404,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur",
    });
  }
};

export const deleteColumnV2Controller = async (req, res) => {
  const { boardId, columnId } = req.params;
  const userId = req.userId;

  if (!boardId) {
    return res.status(400).json({
      status: 400,
      message: "Le boardId est requis.",
    });
  }

  if (!columnId) {
    return res.status(400).json({
      status: 400,
      message: "Le columnId est requis.",
    });
  }

  try {
    const result = await deleteColumnV2Service(boardId, columnId, userId);

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        status: 200,
        message: "Colonne supprimée avec succès.",
        column: result.column,
      });
    }

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        status: 404,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur",
    });
  }
};

export const updateColumnV2Controller = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { title, positionBefore, positionAfter, allowDuplicate } = req.body;
  const userId = req.userId;

  if (!boardId) {
    return res.status(400).json({
      status: 400,
      message: "Le boardId est requis.",
    });
  }

  if (!columnId) {
    return res.status(400).json({
      status: 400,
      message: "Le columnId est requis.",
    });
  }

  try {
    const result = await updateColumnV2Service({
      boardId,
      columnId,
      title,
      positionBefore,
      positionAfter,
      userId,
      allowDuplicate,
    });

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        status: 200,
        message: "Colonne mise à jour avec succès.",
        column: result.column,
      });
    }

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        status: 404,
        message: result.message,
      });
    }

    if (result.status === "EXIST") {
      return res.status(200).json({
        status: 200,
        message: result.message,
        action: result.action,
        column: result.column,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur",
    });
  }
};
