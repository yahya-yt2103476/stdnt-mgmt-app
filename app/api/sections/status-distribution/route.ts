import { NextResponse } from 'next/server';
import SectionRepo from '../../../repos/section-repo';

export async function GET() {
  try {
    const statusDistribution = await SectionRepo.getSectionsStatusDistribution();
    return NextResponse.json(statusDistribution);
  } catch (error) {
    console.error('Error fetching section status distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section status distribution' },
      { status: 500 }
    );
  }
}

