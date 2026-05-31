import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const anggotaIdsStr = formData.getAll('anggotaId[]') as string[];
    const jam = formData.get('jam') as string;
    const lokasiPos = formData.get('lokasiPos') as string;
    const keterangan = formData.get('keterangan') as string;
    const dokumentasi = formData.get('dokumentasi') as File | null;

    if (!anggotaIdsStr || anggotaIdsStr.length === 0 || !jam || !lokasiPos || !keterangan || !dokumentasi) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("IMGBB_API_KEY is missing from environment variables");
      return NextResponse.json({ error: 'Konfigurasi server bermasalah (API Key hilang)' }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await dokumentasi.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const imgbbResult = await imgbbResponse.json();

    if (!imgbbResult.success) {
      console.error('ImgBB Upload Error:', imgbbResult);
      return NextResponse.json({ error: 'Gagal mengunggah foto ke server' }, { status: 500 });
    }

    const dokumentasiUrl = imgbbResult.data.display_url;

    // Save to database
    const laporan = await prisma.laporanPiket.create({
      data: {
        anggotas: {
          connect: anggotaIdsStr.map(id => ({ id: parseInt(id) }))
        },
        jam,
        lokasiPos,
        keterangan,
        dokumentasi: dokumentasiUrl,
      },
    });

    return NextResponse.json({ success: true, data: laporan });
  } catch (error: any) {
    console.error('Error saving laporan:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
