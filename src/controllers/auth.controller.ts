import { FastifyReply, FastifyRequest } from "fastify";
import { loginUserSchema } from "../schemas/auth.schema";
import { loginService } from "../services/auth.service";
import { prisma } from "../plugins/prisma";
import { accessTokenExpires, optionsAccessToken, optionsRefreshToken, refreshTokenExpires } from "../config/auth.config";

export async function loginHandler(req: FastifyRequest, res: FastifyReply) {
  const data = loginUserSchema.parse(req.body);
  const tokenPayload = await loginService(data);

  const accessToken = res.server.jwt.sign(tokenPayload, {
    expiresIn: accessTokenExpires,
  });
  const refreshToken = res.server.jwt.sign(tokenPayload, {
    expiresIn: refreshTokenExpires,
  });

  res.setCookie("accessToken", accessToken, optionsAccessToken);

  res.setCookie("refreshToken", refreshToken, optionsRefreshToken);

  return res.status(200).send({
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}

export async function logoutHandler(req: FastifyRequest, res: FastifyReply) {
  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).send({
    message: "Logout realizado com sucesso",
  });
}

export async function refreshTokenHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  const signedRefreshToken = req.cookies.refreshToken;

  if (!signedRefreshToken) {
    const error: any = new Error("Invalid or missing authentication token.");
    error.code = "INVALID_AUTH_TOKEN";
    throw error;
  }

  const { valid, value } = req.unsignCookie(signedRefreshToken);

  if (!valid || !value) {
    const error: any = new Error("Invalid or missing authentication token.");
    error.code = "INVALID_AUTH_TOKEN";
    throw error;
  }

  try {
    const payload = await res.server.jwt.verify<{ id: string; email: string }>(
      value
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    const tokenPayload = { id: user.id, email: user.email };

    const accessToken = res.server.jwt.sign(tokenPayload, {
      expiresIn: accessTokenExpires,
    });
    const refreshToken = res.server.jwt.sign(tokenPayload, {
      expiresIn: refreshTokenExpires,
    });
  
    res.setCookie("accessToken", accessToken, optionsAccessToken);
  
    res.setCookie("refreshToken", refreshToken, optionsRefreshToken);

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    const err: any = new Error("Invalid or missing authentication token.");
    err.code = "INVALID_AUTH_TOKEN";
    throw err;
  }
}