import { PrismaClient } from '@prisma/client';
import LaporanForm from './LaporanForm';

const prisma = new PrismaClient();

// Prevent static generation since we want fresh database data
export const dynamic = 'force-dynamic';

export default async function LaporanPiketPage() {
  // Fetch anggota from database
  const anggotaList = await prisma.anggota.findMany({
    orderBy: {
      nama: 'asc',
    },
  });

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>Form Laporan Piket</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Silakan isi form di bawah ini untuk melaporkan status piket harian Anda. 
            Pastikan foto dokumentasi diambil langsung dari lokasi.
          </p>
        </div>
        
        <LaporanForm anggotaList={anggotaList} />
      </div>
    </div>
  );
}
