'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// SVG Icons
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
);
const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ width: 'auto', height: '36px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Dashboard</h2>
        </div>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
          <IconMenu />
        </button>
      </div>

      <div className="dashboard-main-wrap">
        {/* Sidebar Overlay for Mobile */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }} className="d-lg-none">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}
            >
              <IconClose />
            </button>
          </div>

          <div style={{ marginBottom: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '50%', marginBottom: '1rem', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image src="/logo.png" alt="Logo Satpol PP" width={64} height={64} style={{ width: 'auto', height: '60px' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '0.5px' }}>Dashboard Admin</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Satpol PP Terpadu</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <Link href="/dashboard" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <IconHome /> Ringkasan
            </Link>
            <Link href="/dashboard/piket" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <IconClipboard /> Laporan Piket
            </Link>
            <Link href="/dashboard/kegiatan-kejadian" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <IconAlert /> Laporan Kegiatan / Kejadian
            </Link>
            <Link href="/dashboard/anggota" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <IconUsers /> Kelola Anggota
            </Link>
            <Link href="/dashboard/admin" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <IconShield /> Kelola Admin
            </Link>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/" className="sidebar-link logout" onClick={() => setIsSidebarOpen(false)}>
              <IconLogout /> Logout / Ke Beranda
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
