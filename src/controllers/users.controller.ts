import { createUserService, getUserByIdService } from "../services/users.services";
import { createUserSchema } from "../schemas/users.schema";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createUserHandler(req: FastifyRequest, res: FastifyReply) {
  const data = createUserSchema.parse(req.body);
  const user = await createUserService(data);
  return res.status(201).send(user);
}

export async function getMeHandler(req: FastifyRequest, res: FastifyReply) {
  const decoded = await req.jwtVerify<{ id: string; email: string }>();

  const user = await getUserByIdService(decoded.id);

  return res.status(200).send(user);
}
