import { NextResponse } from 'next/server';
import registrationRepo from '../../../repos/registration-repo';

export async function GET() {
    try {
        const mostRegisteredCourse = await registrationRepo.getMostRegisteredSemester();
        return NextResponse.json({ mostRegisteredCourse });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch most registered course =.=" },
            { status: 500 }
        )
    }
}