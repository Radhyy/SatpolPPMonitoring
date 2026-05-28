import { PrismaClient } from '@prisma/client';
import AnggotaClient from './AnggotaClient';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function AnggotaDashboardPage() {
  const anggotaList = await prisma.anggota.findMany({
    orderBy: {
      nama: 'asc',
    },
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Kelola Data Anggota
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.5 }}>
          Halaman ini digunakan untuk mengelola daftar nama petugas (anggota) yang berhak melaporkan absensi piket maupun kejadian di lapangan.
        </p>
      </div>
      
      <AnggotaClient initialAnggota={anggotaList} />
    </div>
  );
}
