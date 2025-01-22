import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

let globalMongooseConnection = null;
let globalMongoClient = null;

const connectToDatabase = async () => {
  // Determine whether to use Mongoose or MongoClient based on an environment variable.
  const useMongoose = process.env.USE_MONGOOSE === 'true';

  if (useMongoose) {
  // Check if a Mongoose connection already exists and is ready.
    if (globalMongooseConnection && globalMongooseConnection.readyState === 1) {
      console.log('Mongoose already connected (global)');
      return { db: globalMongooseConnection.db };
    }

    try {
      // Establish a new Mongoose connection if not already connected.  
      globalMongooseConnection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB via Mongoose (global)');
      return { db: globalMongooseConnection.connection.db };
    } catch (error) {
      // Handle connection errors for Mongoose.
      console.error('Error connecting to MongoDB via Mongoose:', error);
      throw new Error('Mongoose connection failed');
    }
  } else {
    // Check if a MongoClient connection already exists and is connected.    
    if (globalMongoClient && globalMongoClient.isConnected()) {
      console.log('MongoClient already connected (global)');
      return { db: globalMongoClient.db(process.env.MONGO_DB_NAME) };
    }

    try {
      // Establish a new MongoClient connection if not already connected.      
      globalMongoClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await globalMongoClient.connect();
      console.log('Connected to MongoDB via MongoClient (global)');
      return { db: globalMongoClient.db(process.env.MONGO_DB_NAME) };
    } catch (error) {
      // Handle connection errors for MongoClient.
      console.error('Error connecting to MongoDB via MongoClient:', error);
      throw new Error('MongoClient connection failed');
    }
  }
};

export default connectToDatabase;
