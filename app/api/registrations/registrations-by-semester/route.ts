import { NextResponse } from 'next/server';
import RegistrationRepo from '../../../repos/registration-repo';

export async function GET() {
    try {
        const registrationsBySemester = await RegistrationRepo.getMostRegisteredSemester();
        return NextResponse.json(registrationsBySemester);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch registrations by semester =.=" },
            { status: 500 }
        )
    }
}
