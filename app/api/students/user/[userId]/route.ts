import { NextResponse } from 'next/server';
import StudentRepo from '../../../../repos/student-repo'; // Adjust path if needed

const studentRepo = new StudentRepo();

export async function GET(request, { params }) {
    console.log("API Route GET invoked for userId.");
    console.log("Received params object:", params);

    try {
        if (!params || typeof params.userId === 'undefined') {
             console.error("API Route: Critical error - params object or params.userId is undefined.");
             return NextResponse.json({ error: "Internal server error: Could not resolve route parameters." }, { status: 500 });
        }

        const userId = params.userId;
        console.log(`API Route: Received User ID parameter: ${userId} (Type: ${typeof userId})`);

        if (isNaN(Number(userId))) {
             console.error(`API Route: Invalid User ID received: ${userId}. Cannot process.`);
              return NextResponse.json({ error: "Invalid User ID format provided." }, { status: 400 });
        }

        console.log(`API Route: Calling findByUserId with User ID: ${userId}`);
        const student = await studentRepo.findByUserId(userId);

        if (!student) {
             console.log(`API Route: Student not found for User ID: ${userId}`);
            return NextResponse.json(
                { error: "Student not found for this user", details: `No student associated with user ID ${userId}` },
                { status: 404 }
            );
        }

        console.log(`API Route: Successfully found student data for User ID ${userId}`);
        return NextResponse.json(student);

    } catch (error) {
        console.error(`API Route: Error processing GET request for User ID ${params?.userId || 'unknown'}:`, error);
        return NextResponse.json(
            { error: "Failed to fetch student data by user ID", details: error.message },
            { status: 500 }
        );
    }
}
