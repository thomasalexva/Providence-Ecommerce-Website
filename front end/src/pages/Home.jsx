import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Search, MapPin, ArrowRight, ShieldCheck, Truck, RotateCcw, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data.slice(0, 4)); // Show top 4 items on landing page
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/listings?keyword=${keyword}&location=${location}`);
  };

  const categories = [
    { name: 'Electronics', count: '120+ Listings', color: '#6366f1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60' },
    { name: 'Furniture', count: '45+ Listings', color: '#a855f7', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=150&auto=format&fit=crop&q=60' },
    { name: 'Home & Kitchen', count: '80+ Listings', color: '#10b981', image: '/home_kitchen.png' },
    { name: 'Accessories', count: '60+ Listings', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* 1. Hero Section */}
      <header className="glass-panel" style={{
        padding: '4rem 3rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(26, 29, 41, 0.9), rgba(99, 102, 241, 0.08))',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--primary)',
          filter: 'blur(120px)',
          opacity: 0.15,
          zIndex: 0
        }} />
        
        <div style={{ zIndex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--primary)'
          }}>Welcome to Tech Store Marketplace</span>
          
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, fontWeight: 800 }}>
            Buy & Sell Locally with <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Ultimate Trust</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            A secure e-commerce gateway designed for the community. Access top products, verify local sellers, and experience instant digital payments.
          </p>
        </div>

        {/* Hero Search Box */}
        <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
          display: 'flex',
          width: '100%',
          maxWidth: '700px',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          gap: '0.5rem',
          alignItems: 'center',
          background: 'rgba(11, 12, 16, 0.8)',
          zIndex: 1,
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="What are you looking for..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />
          
          <div style={{ flex: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
            <MapPin size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Location (e.g. Kozhikode)..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/listings" className="btn btn-secondary">
            Browse All Listings <ArrowRight size={16} />
          </Link>
          {user && (
            <Link to="/listings?create=true" className="btn btn-accent">
              <PlusCircle size={16} /> List Your Product
            </Link>
          )}
        </div>
      </header>

      {/* 2. Benefits Badges */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem'
      }} className="grid-cols-1">
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Verified Accounts</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure profiles and verified seller credentials protect you from fraudulent activities.</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
            <Truck size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Fast Local Delivery</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filter products based on your location and arrange instant, same-day local pick-ups.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(168,85,247,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
            <RotateCcw size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Secure Escrow Payment</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Safe checkout gateways guarantee your money is held securely until delivery confirmation.</p>
          </div>
        </div>
      </section>

      {/* 3. Browse Categories */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Categories</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }} className="grid-cols-2">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/listings?category=${cat.name}`}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'var(--transition-slow)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Listings */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Trending Products</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Handpicked listings uploaded recently near Kozhikode.</p>
          </div>
          <Link to="/listings" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View Marketplace <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Loading fresh items...</span>
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
      </section>
    </div>
  );
};

export default Home;
