import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'providence_secret_key_123';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Fetch user from DB to verify they still exist and are not suspended
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
      }
      
      // Attach user info to request object
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      console.error('Auth verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, administrator privileges required' });
  }
};
