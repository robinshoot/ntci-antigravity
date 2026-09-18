import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      id,
      nra,
      fullName,
      phone,
      domicile,
      avatarUrl,
      motorYear,
      motorColor,
      motorPlate,
      motorMods,
      password,
    } = body;

    // Identify target user by id or nra
    if (!id && !nra && !session?.user?.email) {
      return NextResponse.json({ error: 'Identitas anggota tidak ditemukan' }, { status: 400 });
    }

    // Find existing user in database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(nra ? [{ nra: { equals: nra, mode: 'insensitive' as const } }] : []),
          ...(session?.user?.email ? [{ email: session.user.email }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Data anggota tidak ditemukan di database' }, { status: 404 });
    }

    // Authorization check: User must be editing their own profile or be a SUPER_ADMIN
    if (session?.user) {
      const isSuperAdmin = session.user.role === 'SUPER_ADMIN';
      const isSelf = session.user.id === user.id || session.user.email === user.email || session.user.nra === user.nra;
      if (!isSuperAdmin && !isSelf) {
        return NextResponse.json({ error: 'Anda tidak memiliki hak untuk mengubah profil anggota ini' }, { status: 403 });
      }
    }

    // Build update payload
    const updateData: Record<string, unknown> = {};

    if (fullName && fullName.trim()) updateData.fullName = fullName.trim();
    if (phone && phone.trim()) updateData.phone = phone.trim();
    if (domicile !== undefined) updateData.domicile = domicile.trim() || '-';
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (motorYear !== undefined) updateData.motorYear = motorYear.trim();
    if (motorColor !== undefined) updateData.motorColor = motorColor.trim();
    if (motorPlate !== undefined) updateData.motorPlate = motorPlate.trim();
    if (motorMods !== undefined) updateData.motorMods = motorMods.trim();

    // If new password provided, hash it
    if (password && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: { chapter: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Profil anggota berhasil diperbarui!',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        nra: updatedUser.nra,
        email: updatedUser.email,
        phone: updatedUser.phone,
        domicile: updatedUser.domicile,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        status: ((updatedUser as Record<string, unknown>).status as string) || 'ACTIVE',
        chapterName: updatedUser.chapter ? updatedUser.chapter.name : (updatedUser.isVerified && updatedUser.role === 'SUPER_ADMIN' ? 'Pengurus Pusat' : ''),
        chapterSlug: updatedUser.chapter ? updatedUser.chapter.slug : (updatedUser.isVerified && updatedUser.role === 'SUPER_ADMIN' ? 'pusat' : ''),
        motorModel: updatedUser.motorYear ? `Nmax Turbo (${updatedUser.motorYear})` : 'Nmax Turbo',
        motorYear: updatedUser.motorYear || '2024',
        motorPlate: updatedUser.motorPlate || '-',
        motorColor: updatedUser.motorColor || '-',
        motorMods: updatedUser.motorMods || undefined,
        avatarUrl: updatedUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        joinedDate: new Date(updatedUser.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    });
  } catch (error: unknown) {
    console.error('[API Update Profile Error]:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan perubahan profil' },
      { status: 500 }
    );
  }
}
