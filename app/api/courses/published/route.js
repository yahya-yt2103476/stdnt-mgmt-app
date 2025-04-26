import { NextResponse } from 'next/server';
import PublishedCourseRepo from '../../../repos/published-course-repo';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const semester = searchParams.get('semester');
        if (semester) {
            const publishedCourses = await PublishedCourseRepo.getPublishedCoursesBySemester(semester);
            return NextResponse.json(publishedCourses);
        }
        const publishedCourses = await PublishedCourseRepo.findAll();
        return NextResponse.json(publishedCourses);
    } catch (error) {
        return NextResponse.json({ error: "Published course retrieval failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const publishedCourseData = await request.json();
        const publishedCourse = await PublishedCourseRepo.create(publishedCourseData);
        return NextResponse.json(publishedCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Published course creation failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}