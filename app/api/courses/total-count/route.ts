import { NextResponse } from 'next/server';
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET() {
    try {
        const totalCourses = await courseRepo.getTotalCourses();
        return NextResponse.json(totalCourses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch total courses' }, { status: 500 });
    }
}