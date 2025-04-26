import { NextResponse } from 'next/server';
import CoursePrerequisiteRepo from '../../../../repos/course-prerequisite-repo';

export async function GET(request, { params }) {
    const { id } = params;
    const coursePrerequisite = await CoursePrerequisiteRepo.findById(id);
    return NextResponse.json(coursePrerequisite);
}

export async function PUT(request, { params }) {
    const { id } = params;
    const coursePrerequisiteData = await request.json();
    const coursePrerequisite = await CoursePrerequisiteRepo.update(id, coursePrerequisiteData);
    return NextResponse.json(coursePrerequisite);
}

export async function DELETE(request, { params }) { 
    const { id } = params;
    const coursePrerequisite = await CoursePrerequisiteRepo.delete(id);
    return NextResponse.json(coursePrerequisite);
}



