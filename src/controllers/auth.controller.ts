import { FastifyReply, FastifyRequest } from "fastify";
import { loginService } from "../services/auth.service";
import { loginUserSchema } from "../schemas/auth.schema";

export async function loginHandler(req: FastifyRequest, res: FastifyReply) {
  const data = loginUserSchema.parse(req.body);
  const tokenPayload = await loginService(data);

  const token = res.server.jwt.sign(tokenPayload, {
    expiresIn: "1d",
  });

  // Envia o token via cookie
  res.setCookie("token", token, {
    httpOnly: true, // não acessível via JavaScript (mais seguro)
    secure: process.env.NODE_ENV === "production", // true em produção (HTTPS)
    sameSite: "strict", // protege contra CSRF
    path: "/", // cookie válido para todo o site
    maxAge: 60 * 60 * 24, // 1 dia em segundos
    signed: true, // cookie assinado (requer @fastify/cookie com secret)
  });

  return res.status(200).send({
    message: "Login realizado com sucesso",
  });
}

export async function logoutHandler(req: FastifyRequest, res: FastifyReply) {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).send({
    message: "Logout realizado com sucesso",
  });
}