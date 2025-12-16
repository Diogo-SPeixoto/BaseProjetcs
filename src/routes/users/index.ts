
import { FastifyInstance } from "fastify";
import { createUserHandler, getMeHandler } from "../../controllers/users.controller";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", createUserHandler);
  app.get("/me", { preHandler: [app.authenticate] }, getMeHandler);
}