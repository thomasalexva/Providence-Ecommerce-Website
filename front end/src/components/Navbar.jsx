import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, User, LogOut, Shield, Compass, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="glass-panel" style={{
      margin: '1rem 1.5rem 0 1.5rem',
      borderRadius: 'var(--radius-lg)',
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>T</span>
          Tech <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Store</span>
        </Link>

        {/* Desktop Menu */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.5rem',
          // Use CSS grid media query override for desktop display
        }} className="desktop-menu">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }} className="nav-link">
            <Compass size={18} /> Browse
          </Link>
          
          <Link to="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            position: 'relative'
          }} className="nav-link">
            <ShoppingCart size={18} /> Cart
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px var(--primary-glow)'
              }}>{cartItemCount}</span>
            )}
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--accent)',
                  fontWeight: 600
                }} className="nav-link">
                  <Shield size={18} /> Admin Panel
                </Link>
              )}
              
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }} className="nav-link">
                <User size={18} /> Profile ({user.username.split(' ')[0]})
              </Link>
              
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <LogIn size={16} /> Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Hamburguer Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'block'
        }} className="mobile-menu-btn">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: '0.75rem'
        }} className="mobile-drawer">
          <Link to="/" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
            Browse Marketplace
          </Link>
          <Link to="/cart" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Cart</span>
            {cartItemCount > 0 && <span className="badge badge-info">{cartItemCount} items</span>}
          </Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} style={{ color: 'var(--accent)', padding: '0.5rem 0', fontWeight: 'bold' }}>
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                Profile settings
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* Inline styles for responsive Navbar behavior */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
