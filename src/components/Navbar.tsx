"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-logo">
          <Image src="/logo.png" alt="Logo Satpol PP" width={48} height={48} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
          <span>PORTAL ABSENSI</span>
        </Link>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
          <div className="navbar-menu">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/laporan-piket" onClick={() => setIsOpen(false)}>Laporan Piket</Link>
            <Link href="/laporan-kegiatan-kejadian" onClick={() => setIsOpen(false)}>Laporan Kegiatan / Kejadian</Link>
          </div>

          <div className="navbar-actions">
            <Link href="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
