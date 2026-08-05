import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, domicile, motorYear, motorPlate, motorColor } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: 'Nama, Email, dan Telepon wajib diisi' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email ini sudah terdaftar sebagai anggota NTCI.' },
        { status: 400 }
      );
    }

    // Create User in Vercel Postgres Database without Chapter & NRA (Pending Admin Authorization)
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          email,
          password: '$2a$12$eC9J7s8xYw0rR6xW5q8Z0O6G0u7eX7t9Y9u8i7o6p5a4s3d2f1g', // default hash password
          fullName,
          phone,
          domicile: domicile || '-',
          nra: null, // NRA will be assigned sequentially by Admin upon authorization (e.g. NT-001, NT-093)
          role: 'MEMBER',
          isVerified: false, // PENDING Admin Authorization & Chapter Assignment
          chapterId: null,
          motorYear: motorYear || '2024',
          motorPlate: motorPlate || '-',
          motorColor: motorColor || 'Magma Black',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      });
    } catch (createErr: unknown) {
      console.warn('Prisma create with domicile failed, using fallback query:', createErr);
      // Fallback: Create without domicile argument, then update domicile via raw SQL
      newUser = await prisma.user.create({
        data: {
          email,
          password: '$2a$12$eC9J7s8xYw0rR6xW5q8Z0O6G0u7eX7t9Y9u8i7o6p5a4s3d2f1g',
          fullName,
          phone,
          nra: null,
          role: 'MEMBER',
          isVerified: false,
          chapterId: null,
          motorYear: motorYear || '2024',
          motorPlate: motorPlate || '-',
          motorColor: motorColor || 'Magma Black',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      });

      if (domicile) {
        await prisma.$executeRaw`UPDATE "User" SET "domicile" = ${domicile} WHERE "id" = ${newUser.id}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dikirim dan tersimpan. Menunggu otorisasi Admin & penentuan Chapter.',
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        status: 'PENDING_OTORISASI',
      },
    });
  } catch (err: unknown) {
    console.error('Registration API Error:', err);
    return NextResponse.json(
      { error: 'Gagal menyimpan data ke database. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
