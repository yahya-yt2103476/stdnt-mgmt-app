import { NextResponse } from 'next/server';
import SectionDayRepo from '../../../repos/section-day-repo';

export async function GET(request) {
    try {
        const sectionDays = await SectionDayRepo.findAll();
        return NextResponse.json(sectionDays);
    } catch (error) {
        return NextResponse.json({ error: "Section day retrieval failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const sectionDayData = await request.json();
        const sectionDay = await SectionDayRepo.create(sectionDayData);
        return NextResponse.json(sectionDay, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Section day creation failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}



