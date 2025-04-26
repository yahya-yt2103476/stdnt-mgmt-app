import { NextResponse } from 'next/server';
import CompletedCourseRepo from '../../../../repos/completed-course-repo';

export async function GET(request, { params }) {
    const { id } = params;
    const completedCourse = await CompletedCourseRepo.findById(id);
    return NextResponse.json(completedCourse);
}

export async function PUT(request, { params }) {
    const { id } = params;
    const completedCourseData = await request.json();
    const completedCourse = await CompletedCourseRepo.update(id, completedCourseData);
    return NextResponse.json(completedCourse);
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const completedCourse = await CompletedCourseRepo.delete(id);
    return NextResponse.json(completedCourse);
}


