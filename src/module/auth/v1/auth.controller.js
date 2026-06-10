import { loginV1Service, registerV1Service } from "./auth.service.js";

export const registerV1Controller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerV1Service({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginV1Controller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginV1Service({ email, password });
    res.status(200).json({
      message: "Connexion reussie",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
