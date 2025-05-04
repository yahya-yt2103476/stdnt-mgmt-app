import { NextResponse } from 'next/server';
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET() {
    try {
        const highestFailureRateCourse = await courseRepo.getCourseWithHighestFailureRate();
        return NextResponse.json({ highestFailureRateCourse });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch highest failure rate course =.=" },
            { status: 500 }
        )
    }
}