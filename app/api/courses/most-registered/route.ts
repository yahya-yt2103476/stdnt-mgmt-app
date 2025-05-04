import { NextResponse } from 'next/server';
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET() {
    try {
        const mostRegisteredCourse = await courseRepo.getMostRegisteredCourse();
        return NextResponse.json(mostRegisteredCourse);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch most registered course' }, { status: 500 });
    }
}

