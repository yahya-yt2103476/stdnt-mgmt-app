import { NextResponse } from 'next/server';
import PublishedCourseRepo from '../../../../repos/published-course-repo';

export async function GET(request, { params }) {
    const { id } = params;
    const publishedCourse = await PublishedCourseRepo.findById(id);
    return NextResponse.json(publishedCourse);
}

export async function PUT(request, { params }) {
    const { id } = params;
    const publishedCourseData = await request.json();
    const publishedCourse = await PublishedCourseRepo.update(id, publishedCourseData);
    return NextResponse.json(publishedCourse);
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const publishedCourse = await PublishedCourseRepo.delete(id);
    return NextResponse.json(publishedCourse);
}
