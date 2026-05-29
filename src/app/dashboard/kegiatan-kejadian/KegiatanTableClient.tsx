'use client';

import { useState } from 'react';

type Laporan = {
  id: number;
  tanggal: string | Date;
  kategori: string;
  prioritas: string;
  lokasiMaps: string;
  keterangan: string;
  bukti: string;
  anggota: {
    nama: string;
  };
};

export default function KegiatanTableClient({ laporanKejadian }: { laporanKejadian: Laporan[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLaporan = laporanKejadian.filter((laporan) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      laporan.anggota.nama.toLowerCase().includes(searchLower) ||
      laporan.kategori.toLowerCase().includes(searchLower) ||
      laporan.lokasiMaps.toLowerCase().includes(searchLower);

    // Priority filter
    const matchesPriority = priorityFilter ? laporan.prioritas === priorityFilter : true;

    // Date filter
    const matchesDate = dateFilter 
      ? new Date(laporan.tanggal).toISOString().split('T')[0] === dateFilter
      : true;

    return matchesSearch && matchesPriority && matchesDate;
  });

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case 'Tinggi': return '#ef4444'; // Red
      case 'Sedang': return '#f59e0b'; // Orange
      case 'Rendah': return '#10b981'; // Green
      default: return '#64748b';
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input 
            type="text" 
            placeholder="Cari pelapor, kategori, atau kota..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#f8fafc' }}
          />
        </div>
        <div style={{ width: '140px', flexShrink: 0 }}>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', color: priorityFilter ? '#334155' : '#94a3b8', backgroundColor: 'white', appearance: 'none' }}
          >
            <option value="">Semua Prioritas</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Tanggal</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Pelapor</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Kategori</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Prioritas</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Lokasi</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Bukti</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.map((laporan) => (
                <tr key={laporan.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(laporan.tanggal).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{laporan.anggota.nama}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{laporan.kategori}</td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ 
                      backgroundColor: getPriorityColor(laporan.prioritas) + '15', 
                      color: getPriorityColor(laporan.prioritas), 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {laporan.prioritas}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569', whiteSpace: 'nowrap' }}>
                    {laporan.lokasiMaps.startsWith('http') ? (
                      <a href={laporan.lokasiMaps} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Buka Maps</a>
                    ) : laporan.lokasiMaps}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <button 
                      onClick={() => setSelectedImage(laporan.bukti)}
                      style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      Lihat Foto
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLaporan.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    {laporanKejadian.length === 0 ? 'Belum ada laporan kegiatan / kejadian yang masuk.' : 'Tidak ada laporan yang sesuai dengan filter.'}
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
               <img src={selectedImage} alt="Bukti Kejadian" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '0.25rem' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
