import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { username: 'asc' },
      select: {
        id: true,
        username: true,
        role: true,
        // Exclude password for security reasons
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Gagal memuat data admin' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();
    
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username tersebut sudah digunakan' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        password: password.trim(), // Storing as plaintext for now as per previous prototype
        role: role || 'ADMIN'
      },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Gagal menambahkan akun admin' }, { status: 500 });
  }
}
