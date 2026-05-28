import { PrismaClient } from '@prisma/client';
import KegiatanTableClient from './KegiatanTableClient';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function KejadianDashboardPage() {
  const laporanKejadian = await prisma.laporanKegiatanKejadian.findMany({
    include: {
      anggota: true,
    },
    orderBy: {
      tanggal: 'desc',
    }
  });

  const serializedLaporan = laporanKejadian.map(laporan => ({
    ...laporan,
    tanggal: laporan.tanggal.toISOString(),
  }));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Data Laporan Kegiatan / Kejadian
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.5 }}>
          Halaman ini memuat seluruh data aktivitas rutin penjagaan, pelanggaran perda, hingga kejadian darurat di lapangan. Semua laporan diurutkan dari yang terbaru untuk memudahkan pengawasan dan tindak lanjut.
        </p>
      </div>
      
      <KegiatanTableClient laporanKejadian={serializedLaporan} />
    </div>
  );
}
