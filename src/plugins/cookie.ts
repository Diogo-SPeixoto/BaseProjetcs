import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";

const cookiePlugin = fp(async (app) => {
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, 
  });
});

export default cookiePlugin;

