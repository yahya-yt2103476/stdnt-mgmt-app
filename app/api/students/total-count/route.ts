import { NextResponse } from 'next/server';
import StudentRepo from '../../../repos/student-repo';

const studentRepo = new StudentRepo();

export async function GET() {
    try {
        const totalStudents = await studentRepo.getTotalStudents();
        return NextResponse.json({ totalStudents });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch total number of students =.=" },
            { status: 500 }
        )
    }
}