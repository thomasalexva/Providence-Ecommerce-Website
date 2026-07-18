import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const { cart, user, clearCart } = useApp();
  const navigate = useNavigate();

  // Form states
  const [shippingAddress, setShippingAddress] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0 && !successOrder) {
      navigate('/cart');
      return;
    }
    
    // Fetch profile address if available
    const fetchProfileAddress = async () => {
      try {
        const profile = await api.auth.getProfile();
        if (profile.address) {
          setShippingAddress(profile.address);
        }
        if (profile.username) {
          setCardName(profile.username);
        }
      } catch (err) {
        console.error('Could not pre-fill address:', err);
      }
    };
    if (user) {
      fetchProfileAddress();
    }
  }, [cart, user, navigate, successOrder]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const total = subtotal + shipping;

  const handleCardNumberChange = (e) => {
    // Format card number with spaces every 4 digits
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    // Format expiry as MM/YY
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (val.length > 0) {
      formatted += val.substring(0, 2);
      if (val.length > 2) {
        formatted += '/' + val.substring(2, 4);
      }
    }
    setExpiry(formatted);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !cardName || !cardNumber || !expiry || !cvv) {
      setError('Please fill in all shipping and payment details.');
      return;
    }

    setLoading(true);
    setError('');

    // Prepare items list for backend
    const orderItems = cart.map(item => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || ''
    }));

    try {
      const order = await api.orders.create({
        items: orderItems,
        totalAmount: total,
        shippingAddress,
        paymentDetails: {
          cardNumber: cardNumber.replace(/\s+/g, ''),
          expiry,
          cvv
        }
      });

      // Clear the local cart
      clearCart();
      setSuccessOrder(order);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment transaction failed. Please try a different card.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="animate-fade-in glass-panel" style={{
        maxWidth: '650px',
        margin: '2rem auto',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1.25rem', borderRadius: '50%' }}>
          <CheckCircle2 size={48} />
        </div>
        
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Payment Successful!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Your order has been logged and is now processing.</p>
        </div>

        {/* Order ticket receipt */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'left',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
            <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{successOrder._id}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span className="badge badge-success">Paid / Processing</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
            <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '250px' }}>{successOrder.shippingAddress}</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
            <span>Amount Charged:</span>
            <span style={{ color: 'var(--primary)' }}>${successOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <Link to="/profile" className="btn btn-primary" style={{ flex: 1 }}>
            View Order Logs
          </Link>
          <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Secure Checkout</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Provide your shipping coordinates and payment details.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="grid-cols-1">
        
        {/* Input Details forms */}
        <form onSubmit={handlePaymentSubmit} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Shipping */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', fontSize: '0.8rem' }}>1</span>
              Shipping Destination
            </h2>
            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <textarea 
                className="form-input" 
                placeholder="Street address, city, state, postal code"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                style={{ resize: 'none' }}
                required
              />
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

          {/* Section 2: Payment */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', fontSize: '0.8rem' }}>2</span>
              Credit / Debit Card Details
            </h2>

            <div className="form-group">
              <label className="form-label">Cardholder Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Alex"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Number *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <CreditCard size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expiration Date *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVV *</label>
                <input 
                  type="password" 
                  maxLength="4"
                  className="form-input" 
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--success)" /> Payments processed securely. SSL Encrypted endpoint.
          </div>

          {error && (
            <div className="alert alert-danger" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-accent btn-full" style={{ padding: '0.9rem', fontSize: '1rem' }}>
            {loading ? 'Authorizing Payment Transaction...' : `Securely Pay $${total.toFixed(2)}`}
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Tip: For demo testing, use any valid 16-digit card. Cards ending in "0000" will simulate gateway declines.
          </p>
        </form>

        {/* Order review column */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order Review</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {cart.map(item => (
              <div key={item.product._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img 
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'} 
                  alt={item.product.title} 
                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem' }}>
              <span>Grand Total:</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Payment;
