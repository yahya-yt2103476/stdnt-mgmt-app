import { NextResponse } from 'next/server';
import CourseRepo from '../../repos/course-repo';

const courseRepo = new CourseRepo();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const shortName = searchParams.get('shortName');
    // Check if totalCount is present and not 'false' (allows for ?totalCount=true or just ?totalCount)
    const getTotalCount = searchParams.has('totalCount') && searchParams.get('totalCount') !== 'false';

    try {
        let courses;

        if (shortName) {
            // Prioritize shortName as it's likely more specific
            courses = await courseRepo.findByShortName(shortName);
            // findByShortName returns a single object or null, wrap in array for consistency?
            // Or return directly? Let's return directly as it's a unique lookup.
             if (!courses) {
                 // Optional: Return 404 if not found by shortName
                 return NextResponse.json({ error: 'Course not found with the specified shortName' }, { status: 404 });
             }
             return NextResponse.json(courses);

        } else if (category) {
            // If no shortName, check for category
            if (getTotalCount) {
                // If category and totalCount are requested
                const count = await courseRepo.getTotalCoursesByCategory(category);
                return NextResponse.json({ count: count }); // Return count in a structured object
            } else {
                // If only category is requested
                courses = await courseRepo.findByCategory(category);
                return NextResponse.json(courses);
            }
        } else {
            // If neither shortName nor category is provided, return all
            courses = await courseRepo.findAll();
            return NextResponse.json(courses);
        }

    } catch (error) {
        // Generic error handler for database/server issues
        console.error('Failed to fetch courses:', error); // Log the actual error server-side
        return NextResponse.json(
            { error: 'Failed to fetch courses', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const courseData = await request.json();
        const course = await courseRepo.create(courseData);
        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.error('Failed to create course:', error); // Log the actual error server-side
        return NextResponse.json(
            { error: 'Failed to create course', details: error.message },
            { status: 500 }
        );
    }
}