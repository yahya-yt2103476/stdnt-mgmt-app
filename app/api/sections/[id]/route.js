import { NextResponse } from 'next/server';
import SectionRepo from '../../../repos/section-repo';

export async function GET(request, { params }) {
    try {
        const id = params.id;
        const section = await SectionRepo.findById(id);
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: "Section retrieval failed 0_0", details: error.message },
             { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const section = await SectionRepo.update(id, request.body);
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: "Section update failed 0_0", details: error.message },
             { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const section = await SectionRepo.delete(id);
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: "Section deletion failed 0_0", details: error.message },
             { status: 500 });
    }
}