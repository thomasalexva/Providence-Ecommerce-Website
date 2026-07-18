import express from 'express';
import multer from 'multer';
import path from 'path';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.route('/')
  .get(getProducts)
  .post(protect, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct);

export default router;
