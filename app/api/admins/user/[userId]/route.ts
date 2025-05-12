import { NextResponse } from 'next/server';
import AdminRepo from '../../../../repos/admin-repo'; // Adjusted path

const adminRepo = new AdminRepo();

export async function GET(request, { params }) {
    try {
        const userId = params.userId;
        const admin = await adminRepo.findByUserId(userId); // Use findByUserId

        if (!admin) {
            return NextResponse.json(
                { error: "Admin not found for this user ID =(" },
                { status: 404 }
            )
        }

        return NextResponse.json(admin);

    } catch (error) {
        console.error("Error fetching admin by userId:", error); // Added console log for debugging
        return NextResponse.json(
            { error: "Failed to fetch admin by user ID =(", details: error.message },
            { status: 500 }
        )
    }
}
