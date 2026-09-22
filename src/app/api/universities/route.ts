import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    const universities = await db.university.findMany({
      where: {
        ...(type && type !== 'All' ? { type } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { shortName: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Failed to query universities:', error);
    return NextResponse.json({ error: 'Failed to query universities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to create universities' }, { status: 403 });
    }
    const userName = session.username || 'Meezab Admin';

    const body = await request.json();
    const {
      name,
      shortName,
      type = 'Private Premier',
      location,
      city,
      state,
      qsRank,
      image,
      logo,
      websiteUrl,
      emgsFeeMYR = 3500,
      miscFeesMYR = 6000,
      tuitionBachelor,
      tuitionMaster,
      tuitionPhd,
      hostelMonthly,
      livingCostTier = 'Moderate',
      livingCostMonthly = 1500,
      intakeMonths = 'January, May, September',
      description,
      highlights,
      featured = false,
    } = body;

    if (!name || !shortName || !location) {
      return NextResponse.json(
        { error: 'University name, short acronym, and campus location are required.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(shortName || name);
    let candidateSlug = baseSlug;
    let existing = await db.university.findUnique({ where: { slug: candidateSlug } });
    if (existing) {
      candidateSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const emgsNum = Number(emgsFeeMYR) || 3500;
    const miscNum = Number(miscFeesMYR) || 6000;
    const totalInitial = emgsNum + miscNum;

    // Normalize highlights array or comma string into JSON string
    let highlightsJson: string | null = null;
    if (Array.isArray(highlights)) {
      highlightsJson = JSON.stringify(highlights);
    } else if (typeof highlights === 'string' && highlights.trim()) {
      const parsed = highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);
      highlightsJson = JSON.stringify(parsed);
    }

    const university = await db.university.create({
      data: {
        slug: candidateSlug,
        name: name.trim(),
        shortName: shortName.trim(),
        type,
        location: location.trim(),
        city: city?.trim() || null,
        state: state?.trim() || null,
        qsRank: qsRank?.trim() || null,
        image: image?.trim() || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
        logo: logo?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        emgsFeeMYR: emgsNum,
        miscFeesMYR: miscNum,
        totalInitialMYR: totalInitial,
        tuitionBachelor: tuitionBachelor?.trim() || null,
        tuitionMaster: tuitionMaster?.trim() || null,
        tuitionPhd: tuitionPhd?.trim() || null,
        hostelMonthly: hostelMonthly?.trim() || null,
        livingCostTier: livingCostTier || 'Moderate',
        livingCostMonthly: Number(livingCostMonthly) || 1500,
        intakeMonths: intakeMonths?.trim() || 'January, May, September',
        description: description?.trim() || null,
        highlights: highlightsJson,
        featured: Boolean(featured),
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        title: `Added University: ${university.name}`,
        action: 'CREATE',
        target: university.name,
        user: userName,
        details: `Registered new institution (${university.type}) in ${university.location}`,
      },
    });

    return NextResponse.json({ success: true, university }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create university:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create university.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to update universities' }, { status: 403 });
    }
    const userName = session.username || 'Meezab Admin';

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const emgsNum = data.emgsFeeMYR !== undefined ? Number(data.emgsFeeMYR) : undefined;
    const miscNum = data.miscFeesMYR !== undefined ? Number(data.miscFeesMYR) : undefined;
    const totalInitial =
      emgsNum !== undefined && miscNum !== undefined ? emgsNum + miscNum : undefined;

    let highlightsJson = undefined;
    if (data.highlights !== undefined) {
      if (Array.isArray(data.highlights)) {
        highlightsJson = JSON.stringify(data.highlights);
      } else if (typeof data.highlights === 'string') {
        const parsed = data.highlights
          .split('\n')
          .map((h: string) => h.trim())
          .filter(Boolean);
        highlightsJson = JSON.stringify(parsed);
      }
    }

    const updated = await db.university.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.shortName && { shortName: data.shortName.trim() }),
        ...(data.type && { type: data.type }),
        ...(data.location && { location: data.location.trim() }),
        ...(data.city !== undefined && { city: data.city ? data.city.trim() : null }),
        ...(data.state !== undefined && { state: data.state ? data.state.trim() : null }),
        ...(data.qsRank !== undefined && { qsRank: data.qsRank ? data.qsRank.trim() : null }),
        ...(data.image && { image: data.image.trim() }),
        ...(data.logo !== undefined && { logo: data.logo ? data.logo.trim() : null }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null }),
        ...(emgsNum !== undefined && { emgsFeeMYR: emgsNum }),
        ...(miscNum !== undefined && { miscFeesMYR: miscNum }),
        ...(totalInitial !== undefined && { totalInitialMYR: totalInitial }),
        ...(data.tuitionBachelor !== undefined && { tuitionBachelor: data.tuitionBachelor }),
        ...(data.tuitionMaster !== undefined && { tuitionMaster: data.tuitionMaster }),
        ...(data.tuitionPhd !== undefined && { tuitionPhd: data.tuitionPhd }),
        ...(data.hostelMonthly !== undefined && { hostelMonthly: data.hostelMonthly }),
        ...(data.livingCostTier !== undefined && { livingCostTier: data.livingCostTier }),
        ...(data.livingCostMonthly !== undefined && { livingCostMonthly: Number(data.livingCostMonthly) }),
        ...(data.intakeMonths !== undefined && { intakeMonths: data.intakeMonths }),
        ...(data.description !== undefined && { description: data.description }),
        ...(highlightsJson !== undefined && { highlights: highlightsJson }),
        ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        title: `Updated University: ${updated.name}`,
        action: 'UPDATE',
        target: updated.name,
        user: userName,
        details: `Updated institutional parameters and fees`,
      },
    });

    return NextResponse.json({ success: true, university: updated });
  } catch (error: any) {
    console.error('Failed to update university:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update university.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required to delete universities' }, { status: 403 });
    }

    const adminConfirmed = request.headers.get('x-admin-confirm') === 'true';
    if (!adminConfirmed) {
      return NextResponse.json({ error: 'Admin confirmation required for destructive actions.' }, { status: 400 });
    }

    const userName = session.username || 'Meezab Admin';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'University ID required' }, { status: 400 });
    }

    const uni = await db.university.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        title: `Deleted University: ${uni.name}`,
        action: 'DELETE',
        target: uni.name,
        user: userName,
        details: `Removed institution from system.`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete university:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete university.' },
      { status: 500 }
    );
  }
}
