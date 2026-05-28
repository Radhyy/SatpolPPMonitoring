import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const { username, password, role } = await request.json();

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Username tidak boleh kosong' }, { status: 400 });
    }

    // Check if the new username already exists on ANOTHER user
    const existingUser = await prisma.user.findFirst({
      where: { 
        username: username.trim(),
        NOT: { id: id }
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username tersebut sudah digunakan oleh admin lain' }, { status: 400 });
    }

    const updateData: any = {
      username: username.trim(),
      role: role || 'ADMIN'
    };

    // Only update password if a new one is provided
    if (password && password.trim() !== '') {
      updateData.password = password.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Gagal memperbarui akun admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    // Ensure we don't delete the last admin or the admin currently logged in, 
    // but for simplicity, we just delete here. If you want safety, we can check count.
    const userCount = await prisma.user.count();
    if (userCount <= 1) {
      return NextResponse.json({ error: 'Tidak dapat menghapus satu-satunya akun admin di dalam sistem' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error?.message || 'Gagal menghapus akun admin' }, { status: 500 });
  }
}
