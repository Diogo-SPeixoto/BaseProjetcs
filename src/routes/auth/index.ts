
import { FastifyInstance } from "fastify";
import { loginHandler, logoutHandler } from "../../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance) {
    app.post("/login", loginHandler);
    app.post("/logout", logoutHandler);
}