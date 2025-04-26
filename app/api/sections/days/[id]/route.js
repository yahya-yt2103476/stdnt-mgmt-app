import { NextResponse } from 'next/server';
import SectionDayRepo from '../../../../repos/section-day-repo';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const sectionDay = await SectionDayRepo.findById(id);
        return NextResponse.json(sectionDay);
    } catch (error) {
        return NextResponse.json({ error: "Section day retrieval failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const sectionDayData = await request.json();
        const sectionDay = await SectionDayRepo.update(id, sectionDayData);
        return NextResponse.json(sectionDay);
    } catch (error) {
        return NextResponse.json({ error: "Section day update failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const sectionDay = await SectionDayRepo.delete(id);
        return NextResponse.json(sectionDay);
    } catch (error) {
        return NextResponse.json({ error: "Section day deletion failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}


