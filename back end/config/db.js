import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('\n======================================================');
    console.error('ERROR: MONGODB_URI environment variable is missing.');
    console.error('Please configure your MongoDB connection string in "back end/.env".');
    console.error('======================================================\n');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', false);
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('\n======================================================');
    console.error('ERROR: Failed to connect to MongoDB.');
    console.error('Please verify your connection string in "back end/.env" and your network/firewall settings.');
    console.error(`Details: ${error.message}`);
    console.error('======================================================\n');
    process.exit(1);
  }
};

export default connectDB;
