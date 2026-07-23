import mongoose from 'mongoose'

export async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
}

/** Lightweight ping so Atlas free-tier clusters stay active. */
export async function pingMongo() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error('MongoDB is not connected')
  }
  await mongoose.connection.db.admin().ping()
}
