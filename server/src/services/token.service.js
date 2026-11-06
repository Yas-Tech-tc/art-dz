import jwt from "jsonwebtoken";

const ISSUER = "art-z-api";

export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    issuer: ISSUER,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: ISSUER,
  });
}