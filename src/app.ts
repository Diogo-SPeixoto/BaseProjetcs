
import fastify from "fastify";
import { ZodError } from "zod";
import { usersRoutes } from "./routes/users";
import jwtPlugin from "./plugins/jwt.js";
import prismaPlugin from "./plugins/prisma.js";
import cookiePlugin from "./plugins/cookie.js";
import { ErrorCatalog } from "./errors";
import { authRoutes } from "./routes/auth";

type BusinessErrorCode = keyof typeof ErrorCatalog;

export function buildApp() {
  const app = fastify();

  app.register(prismaPlugin);
  app.register(cookiePlugin);
  app.register(jwtPlugin);
  app.register(usersRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });

  app.setErrorHandler((error, req, reply) => {
    if (error instanceof ZodError) {
      const formatted = error.flatten();
      return reply.status(400).send({
        error: "Bad Request",
        message: "The request contains validation errors.",
        code: "VALIDATION_ERROR",
        details: formatted.fieldErrors,
      });
    }

    // erros de negócio com código
    const code = (error as any).code as BusinessErrorCode | undefined;
    console.log(code)

    if (code && Object.prototype.hasOwnProperty.call(ErrorCatalog, code)) {
      const dataError = ErrorCatalog[code];
      return reply.status(dataError.status).send(dataError);
    }

    // erros de autenticação do fastify-jwt (token inválido/ausente)
    if ((error as any).statusCode === 401) {
      const dataError = ErrorCatalog.INVALID_AUTH_TOKEN;
      return reply.status(dataError.status).send(dataError);
    }

    req.log.error(error);
    return reply.status(500).send({
      error: "Internal Server Error",
      message: "Unexpected error.",
      code: "INTERNAL_ERROR",
    });
  });

  return app;
}