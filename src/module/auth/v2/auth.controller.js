import { createUserV2Service, loginV2Service } from "./auth.service.js";

export const registerV2Controller = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email.trim() || !name.trim() || !password.trim()) {
    return res
      .status(401)
      .json({ message: "tous les champs doivent être remplie" });
  }
  try {
    const user = await createUserV2Service({ email, name, password });
    res.status(201).json({ message: "utilisateur creer avec succes", user });
  } catch (error) {
    res
      .status(401)
      .json({ message: "erreur lors de la creation de l'utilisateur " });
  }
};

export const loginV2Controller = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ message: "les champs sont requis" });
  }

  try {
    const user = await loginV2Service({ email, password });
    res.status(200).json({ message: "Connexion reussie", user });
  } catch (error) {
    res.status(401).json({ message: "connexion echoue" });
  }
};
