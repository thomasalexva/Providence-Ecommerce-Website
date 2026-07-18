import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout & Components
import Navbar from './components/Navbar';

// Page Views
import Home from './pages/Home';
import ProductListings from './pages/ProductListings';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<ProductListings />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>

          {/* Simple Premium Footer */}
          <footer style={{
            marginTop: 'auto',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <p>© {new Date().getFullYear()} Tech Store E-Commerce Marketplace. Built with the MERN Stack.</p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
