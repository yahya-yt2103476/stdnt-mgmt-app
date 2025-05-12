import { NextResponse } from 'next/server';
import InstructorRepo from '../../../../repos/instructor-repo'; // Adjusted path

const instructorRepo = new InstructorRepo();

export async function GET(request, { params }) {
    try {
        const userId = params.userId;
        const instructor = await instructorRepo.findByUserId(userId); // Use findByUserId

        if (!instructor) {
            return NextResponse.json(
                { error: "Instructor not found for this user ID 0-0" },
                { status: 404 }
            )
        }

        return NextResponse.json(instructor);

    } catch (error) {
        console.error("Error fetching instructor by userId:", error); // Added console log for debugging
        return NextResponse.json(
            { error: "Failed to fetch instructor by user ID 0-0", details: error.message },
            { status: 500 }
        )
    }
}
