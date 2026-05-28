import { PrismaClient } from '@prisma/client';
import PiketTableClient from './PiketTableClient';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function PiketDashboardPage() {
  const laporanPiket = await prisma.laporanPiket.findMany({
    include: {
      anggota: true,
    },
    orderBy: {
      tanggal: 'desc',
    }
  });

  const serializedLaporan = laporanPiket.map(laporan => ({
    ...laporan,
    tanggal: laporan.tanggal.toISOString(),
  }));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Data Laporan Piket
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.5 }}>
          Halaman ini menampilkan seluruh riwayat pelaporan absensi piket penjagaan yang diserahkan oleh petugas di lapangan.
        </p>
      </div>
      
      <PiketTableClient laporanPiket={serializedLaporan} />
    </div>
  );
}
