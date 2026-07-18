import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Search, MapPin, Tag, PlusCircle, X, Check } from 'lucide-react';

const ProductListings = () => {
  const { user } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  // Modal / Create listing state
  const [showModal, setShowModal] = useState(searchParams.get('create') === 'true');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newLocation, setNewLocation] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll({
        keyword,
        location,
        category
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch listings. Make sure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Read parameters from URL (e.g. when coming from home page search)
    const urlKeyword = searchParams.get('keyword') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlCreate = searchParams.get('create') === 'true';

    setKeyword(urlKeyword);
    setLocation(urlLocation);
    setCategory(urlCategory);
    
    if (urlCreate && user) {
      setShowModal(true);
    }
    
    fetchListings();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('All');
    setSearchParams({});
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newCategory || !newDescription) {
      setError('Please fill in all required fields.');
      return;
    }

    setCreateLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('price', parseFloat(newPrice));
    formData.append('category', newCategory);
    formData.append('location', newLocation || 'Kozhikode');
    formData.append('description', newDescription);

    if (newImageFile) {
      formData.append('image', newImageFile);
    } else {
      const catMap = {
        'Electronics': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
        'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
        'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
        'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      };
      const defaultImageUrl = catMap[newCategory] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800';
      formData.append('defaultImageUrl', defaultImageUrl);
    }

    try {
      await api.products.create(formData);

      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setShowModal(false);
        const params = {};
        if (keyword) params.keyword = keyword;
        if (location) params.location = location;
        if (category !== 'All') params.category = category;
        setSearchParams(params);
        
        // Reset form
        setNewTitle('');
        setNewPrice('');
        setNewLocation('');
        setNewDescription('');
        setNewImageFile(null);
        
        fetchListings();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to list product.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Marketplace Listings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find local offers or add your own product catalog.</p>
        </div>
        
        {user ? (
          <button onClick={() => setShowModal(true)} className="btn btn-accent">
            <PlusCircle size={18} /> Sell an Item
          </button>
        ) : (
          <Link to="/login?redirect=/listings?create=true" className="btn btn-primary">
            <PlusCircle size={18} /> Log In to Sell
          </Link>
        )}
      </div>

      {/* Search Filter Controls Bar */}
      <form onSubmit={handleFilterSubmit} className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr auto auto',
        gap: '1rem',
        alignItems: 'end'
      }} className="grid-cols-1">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Search Keywords</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="iPhone, headphones, mechanical..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select 
            className="form-input" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ appearance: 'none', background: 'rgba(255,255,255,0.03)' }}
          >
            <option value="All" style={{ background: 'var(--bg-surface)' }}>All Categories</option>
            <option value="Electronics" style={{ background: 'var(--bg-surface)' }}>Electronics</option>
            <option value="Furniture" style={{ background: 'var(--bg-surface)' }}>Furniture</option>
            <option value="Home & Kitchen" style={{ background: 'var(--bg-surface)' }}>Home & Kitchen</option>
            <option value="Accessories" style={{ background: 'var(--bg-surface)' }}>Accessories</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Kozhikode" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', alignSelf: 'end' }}>
          Filter
        </button>

        <button type="button" onClick={handleClearFilters} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', alignSelf: 'end' }}>
          Reset
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Listings Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Searching the shelves...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Tag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No Listings Found</h3>
          <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Try clearing some filters or searching for other items.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }} className="grid-cols-2">
          {products.map((product) => (
            <Link 
              key={product._id} 
              to={`/products/${product._id}`}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'var(--transition-slow)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
            >
              <div style={{ position: 'relative', paddingTop: '75%', width: '100%', background: '#1c1e27' }}>
                <img 
                  src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'} 
                  alt={product.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span className="badge badge-info" style={{ backdropFilter: 'blur(6px)', background: 'rgba(99,102,241,0.8)' }}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} /> {product.location || 'Kozhikode'}
                </span>
                
                <h3 style={{ fontSize: '1rem', fontWeight: 700, flex: 1, lineClamp: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {product.title}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By {product.sellerName.split(' ')[0]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Creation Modal (Sellers form) */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 12, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel animate-slide-up" style={{
            width: '100%',
            maxWidth: '600px',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            position: 'relative',
            background: 'var(--bg-surface)'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {createSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 0', textAlign: 'center' }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '50%' }}>
                  <Check size={40} />
                </div>
                <h2>Listing Created!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Your product is now online on Tech Store Marketplace.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>List a Product for Sale</h2>
                
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Apple iPad Air 5th Gen" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (USD $) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input" 
                      placeholder="e.g. 599.99" 
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-input" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{ appearance: 'none', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <option value="Electronics" style={{ background: 'var(--bg-surface)' }}>Electronics</option>
                      <option value="Furniture" style={{ background: 'var(--bg-surface)' }}>Furniture</option>
                      <option value="Home & Kitchen" style={{ background: 'var(--bg-surface)' }}>Home & Kitchen</option>
                      <option value="Accessories" style={{ background: 'var(--bg-surface)' }}>Accessories</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Location (Town)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Kozhikode" 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Image File (Optional)</label>
                    <input 
                      type="file" 
                      className="form-input" 
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.target.files[0])}
                      style={{ padding: '0.45rem 0.75rem' }}
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description *</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Provide details about condition, specifications, warranty, etc." 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={4}
                    style={{ resize: 'none' }}
                    required
                  />
                </div>

                {error && <div className="alert alert-danger" style={{ padding: '0.5rem 1rem' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={createLoading} className="btn btn-primary" style={{ flex: 1.5 }}>
                    {createLoading ? 'Posting...' : 'Post Listing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListings;
