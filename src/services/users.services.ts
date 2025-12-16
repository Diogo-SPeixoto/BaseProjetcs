
import { hashPassword } from "../utils/hash";
import { prisma } from "../plugins/prisma.js";

export async function createUserService({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error: any = new Error("User already exists");
    error.code = "USER_ALREADY_EXISTS";
    throw error;
  }

  const user = await prisma.user.create({
    data: { name, email, password: await hashPassword(password) },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserByIdService(id: string) {

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const error: any = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
