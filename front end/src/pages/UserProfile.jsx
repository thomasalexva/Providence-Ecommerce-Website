import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { User, Settings, Package, ShoppingBag, Eye, Trash2, MapPin, Phone, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'listings', 'orders'
  
  // Profile form state
  const [username, setUsername] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });

  // Data states
  const [myListings, setMyListings] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const profile = await api.auth.getProfile();
        setUsername(profile.username || '');
        setContactDetails(profile.contactDetails || '');
        setAddress(profile.address || '');
        setProfilePicture(profile.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=siju');
      } catch (err) {
        console.error('Failed to load profile details:', err);
      }
    };
    fetchProfileData();
  }, [user]);

  const loadTabData = async (tab) => {
    setActiveTab(tab);
    if (!user) return;
    
    setDataLoading(true);
    try {
      if (tab === 'listings') {
        const listings = await api.products.getAll({ sellerId: user._id });
        setMyListings(listings);
      } else if (tab === 'orders') {
        const orders = await api.orders.getMyOrders();
        setMyOrders(orders);
      } else if (tab === 'system') {
        const dashboardStats = await api.admin.getStats();
        setStats(dashboardStats);
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage({ text: '', type: '' });

    try {
      const updateData = {
        username,
        contactDetails,
        address,
        profilePicture
      };
      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      setUpdateMessage({ text: 'Profile updated successfully!', type: 'success' });
      setPassword(''); // clear password field
    } catch (err) {
      console.error(err);
      setUpdateMessage({ text: err.message || 'Failed to update profile details.', type: 'danger' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteListing = async (productId) => {
    if (!window.confirm('Delete this product listing? This cannot be undone.')) {
      return;
    }

    try {
      await api.products.delete(productId);
      setMyListings(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete listing.');
    }
  };

  // Avatar presets
  const avatarSeeds = ['siju', 'admin', 'charlie', 'jessica', 'lisa', 'bob'];

  if (!user) {
    return (
      <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>Please log in to manage your profile settings.</p>
        <Link to="/login" className="btn btn-primary">Go to Login Page</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }} className="grid-cols-1">
      
      {/* Sidebar navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* User Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=siju'} 
            alt="User profile" 
            style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--primary)', padding: '0.25rem' }}
          />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user.username}</h2>
            <span className="badge badge-info" style={{ marginTop: '0.25rem' }}>
              {user.role === 'admin' ? 'Administrator' : 'E-commerce User'}
            </span>
          </div>
          <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {user.email}</div>
            {contactDetails && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {contactDetails}</div>}
            {address && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {address.split(',')[0]}</div>}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button 
            onClick={() => loadTabData('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: activeTab === 'profile' ? 'rgba(99,102,241,0.1)' : 'none',
              border: 'none',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Settings size={18} /> Settings & Details
          </button>
          
          {user.role === 'admin' ? (
            <button 
              onClick={() => loadTabData('system')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: activeTab === 'system' ? 'rgba(99,102,241,0.1)' : 'none',
                border: 'none',
                color: activeTab === 'system' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'system' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Shield size={18} /> System Overview
            </button>
          ) : (
            <>
              <button 
                onClick={() => loadTabData('listings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: activeTab === 'listings' ? 'rgba(99,102,241,0.1)' : 'none',
                  border: 'none',
                  color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'listings' ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Package size={18} /> Active Listings
              </button>
              
              <button 
                onClick={() => loadTabData('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: activeTab === 'orders' ? 'rgba(99,102,241,0.1)' : 'none',
                  border: 'none',
                  color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'orders' ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <ShoppingBag size={18} /> Purchase History
              </button>
            </>
          )}
        </div>

      </div>

      {/* Main Tab Content */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
        
        {/* Tab 1: Profile settings */}
        {activeTab === 'profile' && (
          user.role === 'admin' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Profile Settings</h2>
              
              <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '4px solid var(--primary)' }}>
                <Shield size={20} color="var(--primary)" />
                <div>
                  <strong>Administrative Account Protected:</strong> Profile details for administrator accounts are locked and cannot be updated for security compliance.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-cols-1">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={username}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={user.email} 
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value="System Administrator" 
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Profile Settings</h2>
              
              {updateMessage.text && (
                <div className={`alert alert-${updateMessage.type}`}>{updateMessage.text}</div>
              )}

              {/* Avatar Selector */}
              <div className="form-group">
                <label className="form-label">Profile Avatar Seed</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {avatarSeeds.map((seed) => {
                    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                    const isSelected = profilePicture === url;
                    return (
                      <img
                        key={seed}
                        src={url}
                        alt="avatar option"
                        onClick={() => setProfilePicture(url)}
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          padding: '0.1rem',
                          background: 'rgba(255,255,255,0.02)',
                          transition: 'var(--transition-fast)'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-cols-1">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address (Locked)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={user.email} 
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    disabled
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-cols-1">
                <div className="form-group">
                  <label className="form-label">Contact Phone Details</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. +91 9876543210"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password (Leave blank to keep current)</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address Coordinates</label>
                <textarea 
                  className="form-input" 
                  placeholder="Providence Campus, Kozhikode, Kerala"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" disabled={updateLoading} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
                {updateLoading ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          )
        )}

        {/* Tab 2: Active listings */}
        {activeTab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Your Active Sales Catalog</h2>
            
            {dataLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading catalog list...</p>
            ) : myListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <p>You haven't listed any products for sale yet.</p>
                <Link to="/listings?create=true" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>List a Product</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myListings.map(prod => (
                  <div key={prod._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <img src={prod.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150'} alt={prod.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700 }}>{prod.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category: {prod.category} | Location: {prod.location}</p>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${prod.price.toFixed(2)}</div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/products/${prod._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }}>
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => handleDeleteListing(prod._id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Purchase Order History</h2>
            
            {dataLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading orders list...</p>
            ) : myOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <p>No orders logged. You haven't made any purchases yet.</p>
                <Link to="/listings" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Shop</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {myOrders.map(order => (
                  <div key={order._id} style={{
                    padding: '1.5rem',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>ID:</span> <span style={{ fontFamily: 'monospace' }}>{order._id}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Placed: {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </div>
                    
                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.quantity}x</span>
                          <span style={{ flex: 1 }}>{item.title}</span>
                          <span style={{ color: 'var(--text-muted)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ height: '1px', background: 'var(--border-color)' }} />
                    
                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>Ship To: </span> <span style={{ fontWeight: 500 }}>{order.shippingAddress}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                          Payment: {order.paymentStatus}
                        </span>
                        <span className="badge badge-info">
                          Delivery: {order.status}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                          Total: ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: System overview (Admins only) */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>System Overview & Quick Stats</h2>
            
            {dataLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading system statistics...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem'
                }} className="grid-cols-1">
                  <div className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Accounts</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.users}</span>
                  </div>
                  <div className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Listings</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.products}</span>
                  </div>
                  <div className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Transactions</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.orders}</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Administrative Control Panel</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Access full moderator actions including toggling user suspensions, reviewing metrics, and managing all listings.
                  </p>
                  <Link to="/admin" className="btn btn-accent btn-sm" style={{ alignSelf: 'flex-start' }}>
                    Go to Admin Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default UserProfile;
