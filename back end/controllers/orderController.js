import Order from '../models/Order.js';

// @desc    Create a new order & process mock payment
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentDetails } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the shopping cart' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Basic credit card payment validation (mock)
    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      return res.status(400).json({ message: 'Payment information is missing or incomplete' });
    }

    // Simple length checks for card formats to make it feel authentic
    const cleanCard = paymentDetails.cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15 || cleanCard.length > 16) {
      return res.status(400).json({ message: 'Invalid card number format' });
    }

    if (paymentDetails.cvv.length < 3 || paymentDetails.cvv.length > 4) {
      return res.status(400).json({ message: 'Invalid CVV code format' });
    }

    // Determine payment success (simulated)
    // If the card ends in '0000', simulate a failed transaction for demo purposes
    let paymentStatus = 'Paid';
    if (cleanCard.endsWith('0000')) {
      paymentStatus = 'Failed';
      return res.status(402).json({ message: 'Payment transaction declined by payment gateway' });
    }

    // Create the order
    const order = await Order.create({
      buyerId: req.user.id,
      buyerName: req.user.username,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus,
      status: 'Processing'
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Server error processing order checkout' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id });
    // Sort orders manually since mock queries might not sort if using JSON db
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: 'Server error retrieving order history' });
  }
};
