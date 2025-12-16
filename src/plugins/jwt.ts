import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

const jwtPlugin = fp(async (app) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
    cookie: {
      cookieName: "token",
      signed: true,
    },
  });

  app.decorate("authenticate", async (request: FastifyRequest,) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      const error: any = new Error("Invalid or missing authentication token.");
      error.code = "INVALID_AUTH_TOKEN";
      throw error;
    }
  });
});

export default jwtPlugin;


