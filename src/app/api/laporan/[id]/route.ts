import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    await prisma.laporanPiket.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting laporan piket:', error);
    return NextResponse.json({ error: error?.message || 'Gagal menghapus laporan' }, { status: 500 });
  }
}
