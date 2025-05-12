import { NextResponse } from 'next/server';
import PublishedCourseRepo from '../../../../repos/published-course-repo';

export async function GET(request, { params }) {
    try {
        const id = parseInt(params.id);
        const course = await PublishedCourseRepo.findById(id);
        if (!course) {
            return NextResponse.json({ error: "Published course not found" }, { status: 404 });
        }
        return NextResponse.json(course);
    } catch (error) {
        console.error("Error in GET /api/courses/published/[id]:", error);
        return NextResponse.json({ error: "Failed to retrieve published course", details: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id);
        let publishedCourseData = await request.json();
        const updatedCourse = await PublishedCourseRepo.update(id, publishedCourseData);
        if (!updatedCourse) {
            return NextResponse.json({ error: "Published course not found for update" }, { status: 404 });
        }
        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.error("Error in PUT /api/courses/published/[id]:", error);
        if (error.name === 'PrismaClientValidationError') {
            return NextResponse.json({ error: "Invalid data provided for update", details: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update published course", details: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);
        const deletedCourse = await PublishedCourseRepo.delete(id);
        return NextResponse.json({ message: "Published course deleted successfully", data: deletedCourse });
    } catch (error) {
        console.error("Error in DELETE /api/courses/published/[id]:", error);
        if (error.code === 'P2025') { 
            return NextResponse.json({ error: "Published course not found for deletion" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete published course", details: error.message }, { status: 500 });
    }
}
