import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (user) {
      navigate('/payment');
    } else {
      navigate('/login?redirect=/payment');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="animate-fade-in glass-panel" style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '600px',
        margin: '2rem auto'
      }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--primary)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShoppingBag size={32} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't added any products to your purchase list yet.</p>
        <Link to="/listings" className="btn btn-primary">
          Start Browsing Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Shopping Cart</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review your selected items and configure quantity orders.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="grid-cols-1">
        
        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map((item) => (
            <div key={item.product._id} className="glass-panel" style={{
              display: 'flex',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              gap: '1.25rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              
              {/* Image */}
              <img 
                src={item.product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150'} 
                alt={item.product.title} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />

              {/* Title & Seller */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <Link to={`/products/${item.product._id}`} style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {item.product.title}
                </Link>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Seller: {item.product.sellerName} | Location: {item.product.location}
                </p>
              </div>

              {/* Price */}
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                ${item.product.price.toFixed(2)}
              </div>

              {/* Quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button 
                  onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                >-</button>
                <span style={{ padding: '0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                >+</button>
              </div>

              {/* Actions */}
              <button 
                onClick={() => removeFromCart(item.product._id)}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}

          <Link to="/listings" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Panel */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            {shipping > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Add ${(150 - subtotal).toFixed(2)} more to qualify for FREE shipping.
              </p>
            )}

            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800 }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} className="btn btn-accent btn-full" style={{ display: 'flex', gap: '0.5rem', padding: '0.9rem' }}>
            Proceed to Payment <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Cart;
