import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Token maquant" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyToken(token);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invlide" });
  }
};
