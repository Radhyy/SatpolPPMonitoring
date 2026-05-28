import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const anggotaList = await prisma.anggota.findMany({
      orderBy: { nama: 'asc' }
    });
    return NextResponse.json(anggotaList);
  } catch (error) {
    console.error('Error fetching anggota:', error);
    return NextResponse.json({ error: 'Gagal memuat data anggota' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nama } = await request.json();
    
    if (!nama || nama.trim() === '') {
      return NextResponse.json({ error: 'Nama anggota tidak boleh kosong' }, { status: 400 });
    }

    const newAnggota = await prisma.anggota.create({
      data: {
        nama: nama.trim()
      }
    });

    return NextResponse.json(newAnggota);
  } catch (error) {
    console.error('Error creating anggota:', error);
    return NextResponse.json({ error: 'Gagal menambahkan anggota baru' }, { status: 500 });
  }
}
