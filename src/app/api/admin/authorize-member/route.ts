import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, chapterName, nra: inputNra } = body;

    if (!userId || !chapterName) {
      return NextResponse.json(
        { error: 'ID User dan Chapter wajib diisi untuk otorisasi.' },
        { status: 400 }
      );
    }

    // Find Chapter by name/slug
    const chapter = await prisma.chapter.findFirst({
      where: {
        OR: [
          { name: { equals: chapterName, mode: 'insensitive' } },
          { slug: { equals: chapterName, mode: 'insensitive' } },
        ],
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter yang dipilih tidak ditemukan' }, { status: 404 });
    }

    // Determine final NRA (e.g. NT-093, NT-205)
    let finalNra = inputNra?.trim();

    if (!finalNra || finalNra === 'AUTO' || finalNra === 'PENDING' || finalNra === 'PENDING_OTORISASI') {
      const allUsers = await prisma.user.findMany({
        where: { nra: { not: null } },
        select: { nra: true },
      });

      let maxNum = 0;
      for (const u of allUsers) {
        if (u.nra) {
          const match = u.nra.match(/NT-?(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      }

      finalNra = `NT-${String(maxNum + 1).padStart(3, '0')}`;
    }

    // Update User in Vercel Postgres Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        chapterId: chapter.id,
        nra: finalNra,
        isVerified: true, // Officially authorized & verified
      },
      include: { chapter: true },
    });

    return NextResponse.json({
      success: true,
      message: `Anggota ${updatedUser.fullName} telah resmi diotorisasi di ${chapter.name} dengan NRA ${finalNra}.`,
      data: updatedUser,
    });
  } catch (err: unknown) {
    console.error('Authorization API Error:', err);
    return NextResponse.json(
      { error: 'Gagal melakukan otorisasi di database. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
