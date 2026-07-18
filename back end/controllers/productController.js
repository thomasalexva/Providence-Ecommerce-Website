import Product from '../models/Product.js';

// @desc    Get all products (with search & filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, location, sellerId } = req.query;
    let query = {};

    // Filter by seller
    if (sellerId) {
      query.sellerId = sellerId;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by keywords (title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    return res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Server error retrieving products' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Get product by id error:', error);
    return res.status(500).json({ message: 'Server error retrieving product details' });
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  const { title, description, price, category, location, defaultImageUrl } = req.body;

  try {
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields (title, description, price, category)' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    let productImages = [];
    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      productImages.push(fileUrl);
    } else if (defaultImageUrl) {
      productImages.push(defaultImageUrl);
    }

    const product = await Product.create({
      title,
      description,
      price: parsedPrice,
      category,
      location: location || '',
      sellerId: req.user.id,
      sellerName: req.user.username,
      images: productImages
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Server error creating product listing' });
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership or admin privileges
    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product listing' });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Product listing removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error deleting product listing' });
  }
};
