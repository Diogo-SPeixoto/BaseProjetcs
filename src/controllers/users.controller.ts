import { createUserService, getUserByIdService } from "../services/users.services";
import { createUserSchema } from "../schemas/users.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { accessTokenExpires, optionsAccessToken, optionsRefreshToken, refreshTokenExpires } from "../config/auth.config";

export async function createUserHandler(req: FastifyRequest, res: FastifyReply) {
  const data = createUserSchema.parse(req.body);
  const user = await createUserService(data);

  const tokenPayload = { id: user.id, email: user.email };

  const accessToken = res.server.jwt.sign(tokenPayload, {
    expiresIn: accessTokenExpires,
  });
  const refreshToken = res.server.jwt.sign(tokenPayload, {
    expiresIn: refreshTokenExpires,
  });

  res.setCookie("accessToken", accessToken, optionsAccessToken);

  res.setCookie("refreshToken", refreshToken, optionsRefreshToken);

  return res.status(201).send({
    user,
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}

export async function getMeHandler(req: FastifyRequest, res: FastifyReply) {
  const decoded = await req.jwtVerify<{ id: string; email: string }>();

  const user = await getUserByIdService(decoded.id);

  return res.status(200).send(user);
}
