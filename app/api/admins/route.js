import { NextResponse } from 'next/server';
import AdminRepo from '../../repos/admin-repo';

const adminRepo = new AdminRepo();

export async function GET() {
    try {
        const admins = await adminRepo.findAll();
        return NextResponse.json(admins);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch admins", details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const adminData = await request.json();
        const admin = await adminRepo.create(adminData);
        return NextResponse.json(admin, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create admin", details: error.message },
            { status: 500 }
        )
    }
}

