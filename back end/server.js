import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import seedDatabase from './config/seeder.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environmental variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Initialize Express
const app = express();

// Set up CORS
app.use(cors());// Allow ALL origins

// Body Parser Middleware
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Base Status Route
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'Tech Store E-Commerce API is running'
  });
});

// Serve static assets in production if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../front end/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../front end', 'dist', 'index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to DB (will automatically check for MongoDB and fallback to JSON files)
  await connectDB();
  
  // Seed Database (Admin, Client, and sample products)
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
  });
};

startServer();
