"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Simpan status login sederhana di localStorage
        localStorage.setItem('isAdmin', 'true');
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      padding: '2rem 1rem'
    }}>
      <div className="form-container" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo Satpol PP" width={80} height={80} style={{ width: 'auto', height: '80px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', marginBottom: '1rem', display: 'inline-block' }} />
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>Login Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Masuk ke dasbor pengelolaan data absensi dan laporan kejadian.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ fontSize: '0.875rem', padding: '0.75rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="laporan-form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ fontSize: '0.875rem' }}>Username</label>
            <input 
              type="text" 
              id="username" 
              className="form-control" 
              placeholder="Masukkan username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="Masukkan password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading} 
            style={{ width: '100%', padding: '0.875rem' }}
          >
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
