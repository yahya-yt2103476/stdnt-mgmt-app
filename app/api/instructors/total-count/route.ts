import { NextResponse } from 'next/server';
import InstructorRepo from '../../../repos/instructor-repo';

const instructorRepo = new InstructorRepo();

export async function GET() {
    try {
        const totalInstructors = await instructorRepo.getTotalInstructors();
        return NextResponse.json({ totalInstructors });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch total number of instructors =.=" },
            { status: 500 }
        )
    }
}