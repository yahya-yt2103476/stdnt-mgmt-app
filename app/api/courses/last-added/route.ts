import { NextResponse } from "next/server";
import CourseRepo from '../../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET() {
    try {
        const lastAddedCourse = await courseRepo.getLastAddedCourse();
        return NextResponse.json(lastAddedCourse);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch last added course' }, { status: 500 });
    }
}
