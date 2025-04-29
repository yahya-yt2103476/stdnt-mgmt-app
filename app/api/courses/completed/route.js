import { NextResponse } from 'next/server';
import CompletedCourseRepo from '../../../repos/completed-course-repo';

export async function GET(request) {
    try {
        const completedCourses = await CompletedCourseRepo.findAll();
        return NextResponse.json(completedCourses);
    } catch (error) {
        console.error("Error fetching completed courses:", error);
        return NextResponse.json({ 
            error: "Completed course retrieval failed", 
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const completedCourseData = await request.json();
        const completedCourse = await CompletedCourseRepo.create(completedCourseData);
        return NextResponse.json(completedCourse, { status: 201 });
    } catch (error) {
        console.error("Error creating completed course:", error);
        return NextResponse.json({ 
            error: "Completed course creation failed", 
            details: error.message 
        }, { status: 500 });
    }
}
