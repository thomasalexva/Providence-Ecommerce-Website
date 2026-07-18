import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ShoppingCart, Trash2, MapPin, Tag, User, ArrowLeft, ShieldAlert } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.getById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Listing not found or connection failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await api.products.delete(id);
      navigate('/listings');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete listing.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
        <span>Inspecting product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Link to="/listings" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        <div className="alert alert-danger">{error || 'Product not found.'}</div>
      </div>
    );
  }

  const isOwner = user && product.sellerId === user._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Back button */}
      <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>

      <div className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)'
      }} className="grid-cols-1">
        
        {/* Product Image Panel */}
        <div style={{
          background: '#151821',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingTop: '65%' // Aspect ratio box
        }}>
          <img 
            src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'} 
            alt={product.title} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Product Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Category / Location indicators */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Tag size={12} /> {product.category}
              </span>
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} /> {product.location || 'Kozhikode'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{product.title}</h1>
            
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            
            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
            
            {/* Description */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
            
            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
            
            {/* Seller profile card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              alignSelf: 'flex-start'
            }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '50%' }}>
                <User size={16} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Listed by Seller</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{product.sellerName || 'Anonymous'}</p>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Quantity Controls & Checkout */}
            {!isOwner && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, display: 'flex', gap: '0.5rem' }}
                >
                  <ShoppingCart size={18} /> {added ? 'Added to Cart ✓' : 'Add to Shopping Cart'}
                </button>
              </div>
            )}

            {/* Moderation Controls */}
            {(isOwner || isAdmin) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <ShieldAlert size={16} /> Listing Owner or Moderator Controls
                </div>
                <button 
                  onClick={handleDeleteListing}
                  disabled={deleteLoading}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <Trash2 size={16} /> {deleteLoading ? 'Removing Listing...' : 'Remove Listing Permanently'}
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
