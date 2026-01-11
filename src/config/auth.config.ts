import { CookieSerializeOptions } from "@fastify/cookie"

const isProd = process.env.NODE_ENV === "production"

export const optionsAccessToken: CookieSerializeOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  domain: isProd ? "" : "localhost",
  maxAge: 60 * 15,
}

export const optionsRefreshToken: CookieSerializeOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  domain: isProd ? "" : "localhost",
  maxAge: 60 * 60 * 24 * 3,
}

export const accessTokenExpires ="15m"
export const refreshTokenExpires ="3d"