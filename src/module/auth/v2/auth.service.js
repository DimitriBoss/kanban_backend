import { use } from "react";
import prisma from "../../../utils/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/jwt.js";

export const createUserV2Service = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("vous avez deja un compte veillez vous connecter");
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

  return { ...userWithoutPassword };
};

export const loginV2Service = async ({ email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    throw new Error("email ou mot de passe incorrect");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser.passwordHash,
  );
  if (!isPasswordValid) {
    throw new Error("email ou mot de passe incorrect");
  }

  const token = generateToken(existingUser.id);

  const { passwordHash, ...userWithoutPassword } = existingUser;

  return { ...userWithoutPassword, token: token };
};
