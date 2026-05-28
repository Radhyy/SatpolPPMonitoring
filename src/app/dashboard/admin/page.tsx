import { PrismaClient } from '@prisma/client';
import AdminClient from './AdminClient';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      username: 'asc',
    },
    select: {
      id: true,
      username: true,
      role: true,
      // intentionally not fetching password
    }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Kelola Akun Admin
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.5 }}>
          Halaman ini digunakan untuk mengelola kredensial akun-akun yang diizinkan untuk login dan mengakses Dasbor Admin.
        </p>
      </div>
      
      <AdminClient initialUsers={users} />
    </div>
  );
}
