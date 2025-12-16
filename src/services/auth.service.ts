
import { verifyPassword } from "../utils/hash";
import { prisma } from "../plugins/prisma.js";

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error: any = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
    
  }

  const isPassword = await verifyPassword(password, user.password);
  if (!isPassword) {
    const error: any = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return { id: user.id, email: user.email };
}