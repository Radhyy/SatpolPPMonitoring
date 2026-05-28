import { PrismaClient } from '@prisma/client';
import KegiatanKejadianForm from './KegiatanKejadianForm';

const prisma = new PrismaClient();

// Prevent static generation since we want fresh database data
export const dynamic = 'force-dynamic';

export default async function LaporanKegiatanKejadianPage() {
  // Fetch anggota from database for the dropdown
  const anggotaList = await prisma.anggota.findMany({
    orderBy: {
      nama: 'asc',
    },
  });

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>Form Laporan Kegiatan / Kejadian</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Gunakan form ini untuk melaporkan kegiatan rutin, pelanggaran perda, keributan, atau kejadian lapangan lainnya secara cepat. 
            Semua foto akan otomatis dikompres sebelum dikirim.
          </p>
        </div>
        
        <KegiatanKejadianForm anggotaList={anggotaList} />
      </div>
    </div>
  );
}
