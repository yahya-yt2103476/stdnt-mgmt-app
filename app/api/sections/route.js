import { NextResponse } from 'next/server';
import SectionRepo from '../../repos/section-repo';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const semester = searchParams.get('semester');
        const courseId = searchParams.get('courseId');
        const instructorId = searchParams.get('instructorId');
        const status = searchParams.get('status');
        const location = searchParams.get('location');
        const time = searchParams.get('time');

        if (semester && courseId) {
            const sections = await SectionRepo.getSectionsByCourseIdAndSemester(courseId, semester);
            return NextResponse.json(sections);
        }

        if (courseId && instructorId) {
            const sections = await SectionRepo.getSectionsByCourseIdAndInstructorId(courseId, instructorId);
            return NextResponse.json(sections);
        }

        if (semester) {
            const sections = await SectionRepo.getSectionsBySemester(semester);
            return NextResponse.json(sections);
        }

        if (courseId) {
            const sections = await SectionRepo.getSectionsByCourseId(courseId);
            return NextResponse.json(sections);
        } 

        if (instructorId) {
            const sections = await SectionRepo.getSectionsByInstructorId(instructorId);
            return NextResponse.json(sections);
        }

        if (status) {
            const sections = await SectionRepo.getSectionsByStatus(status);
            return NextResponse.json(sections);
        }
        
        if (location) {
            const sections = await SectionRepo.getSectionsByLocation(location);
            return NextResponse.json(sections);
        }

        if (time) { 
            const sections = await SectionRepo.getSectionsByTime(time);
            return NextResponse.json(sections);
        }

        const sections = await SectionRepo.findAll();
        return NextResponse.json(sections);
    } catch (error) {
        return NextResponse.json({ error: "Section retrieval failed 0_0", details: error.message },
        { status: 500 });
    }
}

export async function POST(request) {
    try {
        const section = await SectionRepo.create(request.body);
        return NextResponse.json(section);
    } catch (error) {
        return NextResponse.json({ error: "Section creation failed 0_0", details: error.message },
        { status: 500 });
    }
}

