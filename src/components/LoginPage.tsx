'use client';

import { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        onLogin();
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1a1d23' }}>
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ background: '#2a2d35', border: '1px solid #3a3d45' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8a631" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <path d="M8.12 8.12L12 12" />
              <path d="M20 4L8.12 15.88" />
              <circle cx="6" cy="18" r="3" />
              <path d="M14.8 14.8L20 20" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e4e5e7' }}>
            2D Cutting Optimizer
          </h1>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Industrial Panel Optimization System
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-6 space-y-4"
          style={{ background: '#22252b', border: '1px solid #2e3138' }}
        >
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
              className="w-full px-3 py-2.5 rounded text-sm outline-none transition-colors"
              style={{
                background: '#1a1d23',
                border: '1px solid #3a3d45',
                color: '#e4e5e7',
              }}
              onFocus={e => e.target.style.borderColor = '#e8a631'}
              onBlur={e => e.target.style.borderColor = '#3a3d45'}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2.5 rounded text-sm outline-none transition-colors"
              style={{
                background: '#1a1d23',
                border: '1px solid #3a3d45',
                color: '#e4e5e7',
              }}
              onFocus={e => e.target.style.borderColor = '#e8a631'}
              onBlur={e => e.target.style.borderColor = '#3a3d45'}
            />
          </div>

          {error && (
            <div className="text-xs px-3 py-2 rounded" style={{ background: '#3b1a1a', color: '#f87171', border: '1px solid #5c2626' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2.5 rounded text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#e8a631',
              color: '#1a1d23',
            }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#f0b643'; }}
            onMouseLeave={e => (e.target as HTMLElement).style.background = '#e8a631'}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#4b5563' }}>
          Industrial Panel Optimization v1.0
        </p>
      </div>
    </div>
  );
}
