import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page-container">
      <h1 className="auth-title">Welcome to Airbnb</h1>

      {error && (
        <div style={{ background: '#FFF2F2', border: '1px solid #FFCDD2', color: '#D32F2F', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Demo Quick-Fill Buttons */}
      <div className="demo-credentials-box">
        <strong>⚡ Quick Demo Accounts:</strong>
        <div className="demo-btn-group">
          <button
            type="button"
            className="demo-btn"
            onClick={() => fillCredentials('sarah.host@example.com', 'password123')}
          >
            Sarah (Host)
          </button>
          <button
            type="button"
            className="demo-btn"
            onClick={() => fillCredentials('alex.guest@example.com', 'password123')}
          >
            Alex (Guest)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '12px' }}>
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#717171', marginTop: '20px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#222', fontWeight: 600, textDecoration: 'underline' }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
