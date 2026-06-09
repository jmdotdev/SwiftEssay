import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable')
  }
  return secret
}

export function signToken(payload: any) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" })
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret())
}