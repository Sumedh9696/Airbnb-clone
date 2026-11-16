import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password, role });
      navigate(role === 'host' ? '/host/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <h1 className="auth-title">Create your Airbnb Account</h1>

      {error && (
        <div style={{ background: '#FFF2F2', border: '1px solid #FFCDD2', color: '#D32F2F', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
          />
        </div>

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
          <label>Password (at least 6 characters)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label>I want to join as</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="guest">Guest (I want to explore & book places)</option>
            <option value="host">Host (I want to list properties & earn)</option>
          </select>
        </div>

        <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '12px' }}>
          {loading ? 'Creating account...' : 'Agree & Continue'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#717171', marginTop: '20px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#222', fontWeight: 600, textDecoration: 'underline' }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
