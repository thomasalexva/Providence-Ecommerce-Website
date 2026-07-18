import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ShieldAlert, Users, Package, ShoppingBag, DollarSign, Ban, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useApp();
  
  // Dashboard states
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users', 'orders'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [actionLoading, setActionLoading] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const dashboardStats = await api.admin.getStats();
      const users = await api.admin.getUsers();
      const orders = await api.admin.getOrders();
      setStats(dashboardStats);
      setUsersList(users);
      setOrdersList(orders);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch administrative metrics.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const handleToggleSuspension = async (userId, currentStatus) => {
    const actionText = currentStatus ? 'unsuspend' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionText} this user account?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await api.admin.toggleSuspension(userId);
      // Refresh user lists
      setUsersList(prev => prev.map(u => 
        u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u
      ));
      // Refresh stats
      const dashboardStats = await api.admin.getStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error(err);
      alert(err.message || `Failed to ${actionText} user.`);
    } finally {
      setActionLoading('');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: '1.5rem' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>Administrative access privileges are required to view this dashboard.</p>
        <Link to="/" className="btn btn-primary">Return to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={32} color="var(--accent)" /> Administrative Control Panel
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage accounts suspension and moderate e-commerce listings.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards Row */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Gathering data metrics...</p>
      ) : (
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }} className="grid-cols-2">
          
          {/* Card 1: Users */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Accounts</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.users}</h3>
            </div>
          </div>
          
          {/* Card 2: Products */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Package size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Listings</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.products}</h3>
            </div>
          </div>
          
          {/* Card 3: Orders */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Transactions Logged</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.orders}</h3>
            </div>
          </div>
          
          {/* Card 4: Revenue */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Sales volume</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>

        </section>
      )}

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveSubTab('users')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeSubTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'users' ? 700 : 500,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'var(--transition-fast)'
          }}
        >
          User Accounts Registry
        </button>
        <button
          onClick={() => setActiveSubTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeSubTab === 'orders' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'orders' ? 700 : 500,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'var(--transition-fast)'
          }}
        >
          User Orders Registry
        </button>
      </div>

      {/* User Accounts Management list */}
      {activeSubTab === 'users' ? (
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>User Accounts Registry</h2>
          
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Fetching accounts registries...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Username</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Account Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((userRow) => {
                    const isSuspended = userRow.isSuspended;
                    const isCurrent = userRow._id === user._id;
                    const isAdminRole = userRow.role === 'admin';
                    
                    return (
                      <tr key={userRow._id} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: isSuspended ? 'rgba(239, 68, 68, 0.02)' : 'none',
                        transition: 'var(--transition-fast)'
                      }}>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>
                          {userRow.username} {isCurrent && <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.75rem' }}>(You)</span>}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{userRow.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${isAdminRole ? 'badge-info' : 'badge-secondary'}`} style={{ background: isAdminRole ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)' }}>
                            {userRow.role}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {isSuspended ? (
                            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Ban size={12} /> Suspended / Banned
                            </span>
                          ) : (
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Check size={12} /> Active / Good Standing
                            </span>
                          )}
                        </td>
                        
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {isAdminRole ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Immutable Admin Account</span>
                          ) : (
                            <button
                              onClick={() => handleToggleSuspension(userRow._id, isSuspended)}
                              disabled={actionLoading === userRow._id}
                              className={`btn btn-sm ${isSuspended ? 'btn-secondary' : 'btn-danger'}`}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            >
                              {actionLoading === userRow._id ? (
                                'Updating...'
                              ) : isSuspended ? (
                                'Unsuspend Account'
                              ) : (
                                'Suspend Account'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>User Orders Registry</h2>
          
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Fetching transactions logs...</p>
          ) : ordersList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No transactions or orders logged in the database.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Buyer Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Purchased Items</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Shipping Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {order._id}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700 }}>{order.buyerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {order.buyerId}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.quantity}x</span> {item.title} (${item.price.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-info">
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default AdminPanel;
