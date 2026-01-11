import fp from "fastify-plugin";
import cors from "@fastify/cors";

const corsPlugin = fp(async (app) => {
  app.register(cors, {
    origin: true, // Permite todas as origens em desenvolvimento
    credentials: true, // Permite envio de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
});

export default corsPlugin;

