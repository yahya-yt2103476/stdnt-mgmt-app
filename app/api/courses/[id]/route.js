import { NextResponse } from 'next/server';
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET(request, { params}) {
    try {
        const { id } = params;
        const course = await courseRepo.findById(id);
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch course', details: error.message},
            { status: 500}
        );
    }
}

export async function PUT(request, { params}) {
    try {
        const { id } = params;
        const courseData = await request.json();
        const course = await courseRepo.update(id, courseData);
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update course', details: error.message},
            { status: 500}
        );
    }
}

export async function DELETE(request, { params}) {
    try {
        const { id } = params;
        const course = await courseRepo.delete(id);
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete course', details: error.message},
            { status: 500}
        );
    }
}

