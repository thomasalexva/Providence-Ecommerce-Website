import ModelProxy from './modelFactory.js';

const productSchemaDefinition = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, default: '' },
  sellerId: { type: String, required: true },
  sellerName: { type: String, default: '' },
  images: [{ type: String }]
};

const Product = new ModelProxy('Product', productSchemaDefinition, 'products');

export default Product;
