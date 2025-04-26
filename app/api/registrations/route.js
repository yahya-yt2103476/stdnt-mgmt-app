import { NextResponse } from 'next/server';
import RegistrationRepo from '../../repos/registration-repo';

export async function GET(request) {
    try {
        const registrations = await RegistrationRepo.findAll();
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: "Registration retrieval failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const registrationData = await request.json();
        const registration = await RegistrationRepo.create(registrationData);
        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Registration creation failed 0_0", details: error.message },
            { status: 500 }
        );
    }
}

