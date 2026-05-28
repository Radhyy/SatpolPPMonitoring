import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Untuk keperluan prototype, kita mengembalikan penanda sukses
    // Di aplikasi nyata, sebaiknya gunakan session cookies atau JWT token (misal via next-auth)
    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}
