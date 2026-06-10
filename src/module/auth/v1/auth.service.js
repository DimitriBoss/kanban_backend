import prisma from "../../../utils/prisma.js";
import { generateToken } from "../../../utils/jwt.js";
import bcrypt from "bcrypt";

export const registerV1Service = async ({ name, email, password }) => {
  const userExist = await prisma.user.findUnique({
    where: { email },
  });

  if (userExist) {
    throw new Error("L'utilisateur existe déjà");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });
  const { passwordHash, ...userWithoutPassword } = user;

  const token = generateToken(user.id);

  return {
    user: userWithoutPassword,
    token,
  };
};

export const loginV1Service = async ({ email, password }) => {
  const userExist = await prisma.user.findUnique({
    where: { email },
  });

  if (!userExist) {
    throw new Error("email ou mot de passe incorrect");
  }

  const passwordMatch = await bcrypt.compare(password, userExist.passwordHash);
  if (!passwordMatch) {
    throw new Error("email ou mot de passe incorrect");
  }

  const { passwordHash, ...userWithoutPassword } = userExist;
  const token = generateToken(userExist.id);

  return {
    user: userWithoutPassword,
    token,
  };
};
