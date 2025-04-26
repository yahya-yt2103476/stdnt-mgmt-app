import { NextResponse } from 'next/server';
import InstructorRepo from '../../repos/instructor-repo';

const instructorRepo = new InstructorRepo();

export async function GET() {
    try {
        const instructors = await instructorRepo.findAll();
        return NextResponse.json(instructors);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch instructors 0-0", details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const instructorData = await request.json();
        const instructor = await instructorRepo.create(instructorData);
        return NextResponse.json(instructor, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create instructor 0-0", details: error.message },
            { status: 500 }
        )
    }
}
