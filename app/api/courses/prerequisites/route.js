import { NextResponse } from 'next/server';
import CoursePrerequisiteRepo from '../../../repos/course-prerequisite-repo';

export async function GET(request) {
    try {
        const coursePrerequisites = await CoursePrerequisiteRepo.findAll();
        return NextResponse.json(coursePrerequisites);
    } catch (error) {
        return NextResponse.json({ error: "Course prerequisite retrieval failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const coursePrerequisiteData = await request.json();
        const coursePrerequisite = await CoursePrerequisiteRepo.create(coursePrerequisiteData);
        return NextResponse.json(coursePrerequisite, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Course prerequisite creation failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}
