import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const { nama } = await request.json();

    if (!nama || nama.trim() === '') {
      return NextResponse.json({ error: 'Nama anggota tidak boleh kosong' }, { status: 400 });
    }

    const updatedAnggota = await prisma.anggota.update({
      where: { id },
      data: { nama: nama.trim() }
    });

    return NextResponse.json(updatedAnggota);
  } catch (error) {
    console.error('Error updating anggota:', error);
    return NextResponse.json({ error: 'Gagal memperbarui nama anggota' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    // Prisma automatically throws if deletion violates foreign key constraint 
    // unless cascading is enabled. Since cascading is not explicitly defined in schema, 
    // it will throw an error if this anggota has reports.
    await prisma.anggota.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting anggota:', error);
    
    // Check for Prisma foreign key constraint failure code
    if (error?.code === 'P2003' || (error?.message && error.message.includes('Foreign key constraint failed')) || (error?.message && error.message.includes('P2003'))) {
      return NextResponse.json(
        { error: 'Anggota ini tidak dapat dihapus karena sudah memiliki riwayat laporan (piket/kejadian).' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: error?.message || 'Gagal menghapus data anggota' }, { status: 500 });
  }
}
