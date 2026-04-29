import mongoose from "mongoose";

// We ONLY want to use the Environment Variable. 
// No local fallback so we can catch configuration errors immediately.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Check if your .env.local file exists in the root folder."
  );
}

let cached: any = (global as any).__mongoose;
if (!cached) cached = (global as any).__mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // We removed dbName here because it's best to include it in the connection string itself
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset the promise so we can try again on next request
    throw e;
  }

  return cached.conn;
}