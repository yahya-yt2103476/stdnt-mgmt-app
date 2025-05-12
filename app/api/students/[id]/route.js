import { NextResponse } from 'next/server';
import StudentRepo from '../../../repos/student-repo';

const studentRepo = new StudentRepo();

export async function GET(request, { params }) {
    console.log("API Route GET invoked for student ID.");
    console.log("Received params object:", params);
    
    try {
        if (!params || typeof params.id === 'undefined') {
             console.error("API Route: Critical error - params object or params.id is undefined.");
             return NextResponse.json({ error: "Internal server error: Could not resolve route parameters." }, { status: 500 });
        }

        const studentId = params.id;
        console.log(`API Route: Received Student ID parameter: ${studentId} (Type: ${typeof studentId})`);

        if (isNaN(Number(studentId))) {
             console.error(`API Route: Invalid Student ID received: ${studentId}. Cannot process.`);
              return NextResponse.json({ error: "Invalid Student ID format provided." }, { status: 400 });
        }

        console.log(`API Route: Calling findById with Student ID: ${studentId}`);
        const student = await studentRepo.findById(studentId);

        if (!student) {
             console.log(`API Route: Student not found for Student ID: ${studentId}`);
            return NextResponse.json(
                { error: "Student not found", details: `No student associated with ID ${studentId}` },
                { status: 404 }
            );
        }
        
        console.log(`API Route: Successfully found student data for Student ID ${studentId}`);
        return NextResponse.json(student);

    } catch (error) {
        console.error(`API Route: Error processing GET request for Student ID ${params?.id || 'unknown'}:`, error);
        return NextResponse.json(
            { error: "Failed to fetch student data", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const studentId = params.id;
        if (!params || typeof params.id === 'undefined' || isNaN(Number(studentId))) {
             console.error(`API Route PUT: Invalid/missing Student ID: ${params?.id}`);
             return NextResponse.json({ error: "Invalid request: Missing or invalid Student ID" }, { status: 400 });
        }
        const studentData = await request.json();
        console.log(`API Route: Updating student with Student ID: ${studentId}`);
        const updatedStudent = await studentRepo.update(studentId, studentData);
        return NextResponse.json(updatedStudent);
    } catch (error) {
        console.error(`API Route: Error updating student with Student ID ${params?.id}:`, error);
        return NextResponse.json(
            { error: "Failed to update student", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const studentId = params.id;
        if (!params || typeof params.id === 'undefined' || isNaN(Number(studentId))) {
             console.error(`API Route DELETE: Invalid/missing Student ID: ${params?.id}`);
             return NextResponse.json({ error: "Invalid request: Missing or invalid Student ID" }, { status: 400 });
        }
        console.log(`API Route: Deleting student with Student ID: ${studentId}`);
        await studentRepo.delete(studentId);
        return NextResponse.json(
            { message: "Student deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(`API Route: Error deleting student with Student ID ${params?.id}:`, error);
        return NextResponse.json(
            { error: "Failed to delete student", details: error.message },
            { status: 500 }
        );
    }
}


