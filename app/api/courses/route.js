import { NextResponse } from 'next/server';
import CourseRepo from '../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const shortName = searchParams.get('shortName');

    try {
        if (!(category || shortName)) {
            const courses = await courseRepo.findAll();
            return NextResponse.json(courses);
        } else if (category) {
            const courses = await courseRepo.findByCategory(category);
            return NextResponse.json(courses);
        } else if (shortName) {
            const courses = await courseRepo.findByShortName(shortName);
            return NextResponse.json(courses);
        } 
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch courses', details: error.message},
            { status: 500}  
        );
    }
}

export async function POST(request) {
    try {
        const courseData = await request.json();
        const course = await courseRepo.create(courseData);
        return NextResponse.json(course, { status: 201});
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create course', details: error.message},
            { status: 500}
        );
    }
}