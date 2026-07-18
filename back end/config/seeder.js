import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments({});
    
    if (userCount === 0) {
      console.log('Seeding initial database accounts...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedAdminPassword = await bcrypt.hash('admin123', salt);
      const hashedClientPassword = await bcrypt.hash('client123', salt);

      // Create Admin
      const admin = await User.create({
        username: 'Admin Providence',
        email: 'admin@techstore.com',
        password: hashedAdminPassword,
        role: 'admin',
        contactDetails: '+91 98765 43210',
        profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
        address: 'Providence Campus, Kozhikode, Kerala'
      });

      // Create Client
      const client = await User.create({
        username: 'Alen E-Commerce',
        email: 'alen@techstore.com',
        password: hashedClientPassword,
        role: 'client',
        contactDetails: '+91 99999 88888',
        profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alen',
        address: 'Kozhikode Town, Kerala'
      });

      console.log('Admin account created: admin@techstore.com / admin123');
      console.log('Client account created: alen@techstore.com / client123');
      
      // Create initial products
      console.log('Seeding initial products...');
      const products = [
        {
          title: 'iPhone 15 Pro Max',
          description: 'Experience titanium design, 5x Telephoto camera, and the industry-leading A17 Pro chip. Fully unlocked.',
          price: 1399.99,
          category: 'Electronics',
          location: 'Kozhikode',
          sellerId: admin._id,
          sellerName: 'Admin Providence',
          images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80']
        },
        {
          title: 'Sony WH-1000XM5 Wireless Headphones',
          description: 'Industry leading noise canceling headphones with dual processors, 8 microphones, and crystal clear call quality.',
          price: 349.99,
          category: 'Electronics',
          location: 'Kochi',
          sellerId: admin._id,
          sellerName: 'Admin Providence',
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80']
        },
        {
          title: 'Ergonomic Mesh Office Chair',
          description: 'High back office chair with adjustable lumbar support, 3D armrests, and dynamic reclining functionality.',
          price: 249.50,
          category: 'Furniture',
          location: 'Kozhikode',
          sellerId: admin._id,
          sellerName: 'Admin Providence',
          images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80']
        },
        {
          title: 'Mechanical Keychron K2 Keyboard',
          description: 'Compact 75% layout wireless keyboard with Gateron brown switches and beautiful RGB aluminum frames.',
          price: 89.99,
          category: 'Electronics',
          location: 'Trivandrum',
          sellerId: client._id,
          sellerName: 'Siju E-Commerce',
          images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80']
        },
        {
          title: 'Premium Espresso & Coffee Machine',
          description: 'Brew professional grade espresso, cappuccinos, and lattes at home with integrated milk steam frother.',
          price: 199.99,
          category: 'Home & Kitchen',
          location: 'Kozhikode',
          sellerId: client._id,
          sellerName: 'Siju E-Commerce',
          images: ['https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=80']
        },
        {
          title: 'Waterproof Canvas Travel Backpack',
          description: 'Heavy duty laptop compartment backpack with leather buckles, expandable side pockets, and USB charging port.',
          price: 65.00,
          category: 'Accessories',
          location: 'Bangalore',
          sellerId: client._id,
          sellerName: 'Siju E-Commerce',
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80']
        }
      ];

      for (const p of products) {
        await Product.create(p);
      }
      console.log('Seeded 6 sample products successfully!');
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};

export default seedDatabase;
