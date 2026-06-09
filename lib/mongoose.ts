// lib/mongoose.ts
import mongoose from "mongoose"

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }
  return uri
}

declare global {
  var mongoose: { conn: any; promise: any }
}

let cached = global.mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri())
  }

  cached.conn = await cached.promise
  return cached.conn
}