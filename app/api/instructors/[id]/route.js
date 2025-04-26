import { NextResponse } from 'next/server';
import InstructorRepo from '../../../repos/instructor-repo';

const instructorRepo = new InstructorRepo();

export async function GET(request, { params }) {
    try {
        const id = params.id;
        const instructor = await instructorRepo.findById(id);

        if (!instructor) {
            return NextResponse.json(
                { error: "Instructor not found 0-0" },
                { status: 404 }
            )
        }

        return NextResponse.json(instructor);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch instructor 0-0", details: error.message },
            { status: 500 }
        )
    }
}

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const instructorData = await request.json();
        const updatedInstructor = await instructorRepo.update(id, instructorData);
        
        if (!updatedInstructor) {
            return NextResponse.json(
                { error: "Instructor not found 0-0" },
                { status: 404 }
            )
        }

        return NextResponse.json(updatedInstructor);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update instructor 0-0", details: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const deletedInstructor = await instructorRepo.delete(id);

        if (!deletedInstructor) {
            return NextResponse.json(
                { error: "You are trying to delete a non-existent instructor 0-0" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Instructor deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete instructor 0-0", details: error.message },
            { status: 500 }
        )
    }
}
