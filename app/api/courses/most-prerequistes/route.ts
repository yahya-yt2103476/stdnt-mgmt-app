import { NextResponse } from 'next/server';
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET() {
    try {
        const mostPrerequisites = await courseRepo.getCourseWithMostPrerequisites();
        return NextResponse.json(mostPrerequisites);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch course with most prerequisites =.=" },
            { status: 500 }
        )
    }
}