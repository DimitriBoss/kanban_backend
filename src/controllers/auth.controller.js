import { loginService, registerService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerService({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginService({ email, password });
    res.status(200).json({
      message: "Connexion reussie",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
