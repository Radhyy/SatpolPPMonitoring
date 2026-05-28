import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// SVG Icons
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconClipboardList = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
const IconSiren = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z"/><path d="M5 20.5a17.16 17.16 0 0 1 7-2.5 17.16 17.16 0 0 1 7 2.5"/><path d="M12 6V3"/><path d="m16.87 7.42 2.12-2.12"/><path d="m7.13 7.42-2.12-2.12"/></svg>;

export default async function DashboardOverview() {
  const [totalPiket, totalKejadian, totalAnggota, recentKejadian, recentPiket] = await Promise.all([
    prisma.laporanPiket.count(),
    prisma.laporanKegiatanKejadian.count(),
    prisma.anggota.count(),
    prisma.laporanKegiatanKejadian.findMany({
      take: 5,
      orderBy: { tanggal: 'desc' },
      include: { anggota: true }
    }),
    prisma.laporanPiket.findMany({
      take: 5,
      orderBy: { tanggal: 'desc' },
      include: { anggota: true }
    })
  ]);

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case 'Tinggi': return '#ef4444';
      case 'Sedang': return '#f59e0b';
      case 'Rendah': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>Ringkasan Sistem</h1>
      
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#eff6ff', color: 'var(--primary)', padding: '1rem', borderRadius: '0.75rem', marginRight: '1.5rem' }}>
            <IconUsers />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Anggota</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>{totalAnggota}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '1rem', borderRadius: '0.75rem', marginRight: '1.5rem' }}>
            <IconClipboardList />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Laporan Piket</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>{totalPiket}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginRight: '1.5rem' }}>
            <IconSiren />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Laporan Kegiatan/Kejadian</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>{totalKejadian}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Laporan Kejadian Terbaru */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>Kegiatan / Kejadian Terbaru</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="table-responsive">
            {recentKejadian.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Pelapor</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Kategori</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Prioritas</th>
                  </tr>
                </thead>
                <tbody>
                  {recentKejadian.map((kej) => (
                    <tr key={kej.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{kej.anggota.nama}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{kej.kategori}</td>
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ 
                          backgroundColor: getPriorityColor(kej.prioritas) + '15', 
                          color: getPriorityColor(kej.prioritas), 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '9999px',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}>
                          {kej.prioritas}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                Belum ada data kegiatan / kejadian terbaru.
              </div>
            )}
            {recentKejadian.length > 0 && (
              <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Link href="/dashboard/kegiatan-kejadian" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Lihat Semua Kegiatan/Kejadian &rarr;
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Laporan Piket Terbaru */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>Piket Terbaru</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div className="table-responsive">
            {recentPiket.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Petugas</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Shift</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPiket.map((piket) => (
                    <tr key={piket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{piket.anggota.nama}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{piket.shift}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{piket.lokasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                Belum ada data piket terbaru.
              </div>
            )}
            {recentPiket.length > 0 && (
              <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Link href="/dashboard/piket" style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Lihat Semua Piket &rarr;
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
