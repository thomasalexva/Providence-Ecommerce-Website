import ModelProxy from './modelFactory.js';

const orderSchemaDefinition = {
  buyerId: { type: String, required: true },
  buyerName: { type: String, default: '' },
  items: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  status: { type: String, default: 'Processing', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] }
};

const Order = new ModelProxy('Order', orderSchemaDefinition, 'orders');

export default Order;
