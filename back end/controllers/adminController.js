import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get dashboard metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const productCount = await Product.countDocuments({});
    const orderCount = await Order.countDocuments({});
    
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return res.json({
      users: userCount,
      products: productCount,
      orders: orderCount,
      revenue: Math.round(totalRevenue * 100) / 100
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Server error retrieving dashboard stats' });
  }
};

// @desc    Get all user accounts
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // Return all users, excluding passwords
    const users = await User.find({});
    const safeUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isSuspended: user.isSuspended || false,
      contactDetails: user.contactDetails,
      address: user.address,
      createdAt: user.createdAt
    }));
    return res.json(safeUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Server error retrieving user accounts' });
  }
};

// @desc    Toggle suspension on a user account (suspend/unsuspend)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
export const toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot suspend an administrator account' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    return res.json({
      message: `User account has been ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        isSuspended: user.isSuspended
      }
    });
  } catch (error) {
    console.error('Toggle suspension error:', error);
    return res.status(500).json({ message: 'Server error updating user suspension status' });
  }
};

// @desc    Get all user orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ message: 'Server error retrieving all orders' });
  }
};

