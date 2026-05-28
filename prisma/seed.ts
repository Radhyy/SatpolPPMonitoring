import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const anggotaNames = [
    'Budi Santoso',
    'Ahmad Fauzi',
    'Siti Nurhaliza',
    'Rudi Hartono',
    'Andi Pratama',
    'Dewi Lestari',
    'Hendra Setiawan',
    'Putri Kusuma'
  ]

  console.log('Start seeding ...')

  for (const nama of anggotaNames) {
    const anggota = await prisma.anggota.create({
      data: {
        nama,
      },
    })
    console.log(`Created anggota with id: ${anggota.id} and name: ${anggota.nama}`)
  }

  console.log('Seeding finished.')

  console.log('Creating Admin user ...')
  const adminExists = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!adminExists) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: 'admin123',
        role: 'ADMIN',
      }
    })
    console.log('Admin user created (admin / admin123)')
  } else {
    console.log('Admin user already exists.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
