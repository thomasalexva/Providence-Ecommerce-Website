import express from 'express';
import { getDashboardStats, getAllUsers, toggleUserSuspension, getAllOrders } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
// Create a modular Express router for admin-related routes
const router = express.Router();

router.use(protect); // Step 1: Verify JWT token — user must be logged in
router.use(adminOnly); // Step 2: Verify role === 'admin' — logged in user must be an admin

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/users/:id/suspend', toggleUserSuspension);

export default router;
