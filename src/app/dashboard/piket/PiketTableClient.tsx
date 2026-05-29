'use client';

import { useState } from 'react';

type Laporan = {
  id: number;
  tanggal: string;
  shift: string;
  lokasi: string;
  dokumentasi: string;
  anggota: {
    nama: string;
  };
};

export default function PiketTableClient({ laporanPiket }: { laporanPiket: Laporan[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan piket ini?')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/laporan/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Gagal menghapus laporan');
        setIsDeleting(null);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus laporan');
      setIsDeleting(null);
    }
  };

  const filteredLaporan = laporanPiket.filter((laporan) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      laporan.anggota.nama.toLowerCase().includes(searchLower) ||
      laporan.shift.toLowerCase().includes(searchLower) ||
      laporan.lokasi.toLowerCase().includes(searchLower);

    // Date filter
    const matchesDate = dateFilter 
      ? new Date(laporan.tanggal).toISOString().split('T')[0] === dateFilter
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'nowrap', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: 0 }}>
          <input 
            type="text" 
            placeholder="Cari laporan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#f8fafc' }}
          />
        </div>
        <div style={{ width: '140px', flexShrink: 0 }}>
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', color: dateFilter ? '#334155' : '#94a3b8' }}
          />
        </div>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Tanggal</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Petugas</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Shift</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Lokasi</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLaporan.map((laporan) => (
              <tr key={laporan.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(laporan.tanggal).toLocaleString('id-ID')}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{laporan.anggota.nama}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{laporan.shift}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569', whiteSpace: 'nowrap' }}>{laporan.lokasi}</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setSelectedImage(laporan.dokumentasi)}
                      style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--primary)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      Foto
                    </button>
                    <button 
                      onClick={() => handleDelete(laporan.id)}
                      disabled={isDeleting === laporan.id}
                      style={{ backgroundColor: 'white', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: isDeleting === laporan.id ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', whiteSpace: 'nowrap', opacity: isDeleting === laporan.id ? 0.5 : 1 }}
                      onMouseEnter={(e) => { if (isDeleting !== laporan.id) { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; } }}
                      onMouseLeave={(e) => { if (isDeleting !== laporan.id) { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#fee2e2'; } }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLaporan.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  {laporanPiket.length === 0 ? 'Belum ada laporan piket yang masuk.' : 'Tidak ada laporan yang sesuai dengan filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '-1rem', right: '-1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '2.5rem', height: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div style={{ position: 'relative', width: '100%', height: '100%', minWidth: '200px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
               <img src={`/api/proxy-image?url=${encodeURIComponent(selectedImage)}`} alt="Bukti Piket" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '0.25rem' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
