import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { KeyRound, Mail, User, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const { login, register, user } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirect = searchParams.get('redirect') || '/';
  
  // Toggle registration mode
  const [isRegister, setIsRegister] = useState(false);
  
  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Please fill in all credentials.');
      return;
    }

    if (isRegister) {
      if (!username) {
        setError('Username is required.');
        return;
      }
      if (password !== confirmPassword) {
        // Trimming password check
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(username.trim(), sanitizedEmail, password); // keep password as typed for registration, but trim username/email
      } else {
        await login(sanitizedEmail, sanitizedPassword);
      }
      // User is redirected by the useEffect hook
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0',
      minHeight: '80vh'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), var(--shadow-glow)',
        background: 'linear-gradient(135deg, rgba(26,29,41,0.95), rgba(99,102,241,0.05))',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            {isRegister ? 'Join the Tech Store community' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Username (Register Only) */}
          {isRegister && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="alen@techstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Confirm Password (Register Only) */}
          {isRegister && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-accent btn-full" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            {isRegister ? (
              <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><UserPlus size={18} /> {loading ? 'Registering...' : 'Register Account'}</span>
            ) : (
              <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><LogIn size={18} /> {loading ? 'Signing In...' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button onClick={toggleMode} style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0
          }}>
            {isRegister ? 'Sign In Here' : 'Create One Here'}
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Testing Accounts (Preseeded):</p>
          <p>• Client: <b>alen@techstore.com</b> / password: <b>client123</b></p>
          <p>• Admin: <b>admin@techstore.com</b> / password: <b>admin123</b></p>
        </div>

      </div>
    </div>
  );
};

export default Login;
