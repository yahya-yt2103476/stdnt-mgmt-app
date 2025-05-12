import { NextResponse } from 'next/server';
import SectionRepo from '../../../repos/section-repo';
import RegistrationRepo from '../../../repos/registration-repo';

const MIN_REGISTRATIONS_FOR_APPROVAL = 3; 

export async function GET(request, context) {
    try {
        const id = parseInt(context.params.id);
        const section = await SectionRepo.findById(id);
        if (!section) {
             return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }
        return NextResponse.json(section);
    } catch (error) {
        console.error("Error in GET /api/sections/[id]:", error);
        return NextResponse.json({ error: "Section retrieval failed", details: error.message },
             { status: 500 });
    }
}

export async function PUT(request, context) {
    try {
        const id = parseInt(context.params.id);
        const sectionData = await request.json();

        if (sectionData.status === 'APPROVED') {
            console.log("Inspecting RegistrationRepo object:", RegistrationRepo); 
            console.log("Type of RegistrationRepo:", typeof RegistrationRepo); 
            console.log("Available methods:", Object.getOwnPropertyNames(RegistrationRepo.constructor.prototype)); 
            console.log("Available keys on instance:", RegistrationRepo ? Object.keys(RegistrationRepo) : "RegistrationRepo is null/undefined"); 

            const activeRegistrationCount = await RegistrationRepo.countActiveRegistrationsForSection(id);
            console.log(`Section ${id}: Found ${activeRegistrationCount} active registrations for approval. Required: ${MIN_REGISTRATIONS_FOR_APPROVAL}`);
            if (activeRegistrationCount < MIN_REGISTRATIONS_FOR_APPROVAL) {
                return NextResponse.json(
                    { 
                        error: "Section approval failed", 
                        details: `Insufficient active registrations (${activeRegistrationCount}). Minimum required: ${MIN_REGISTRATIONS_FOR_APPROVAL}.` 
                    },
                    { status: 400 } 
                );
            }
            console.log(`Section ${id}: Sufficient registrations found. Proceeding with approval.`);
        } 
        
        else if (sectionData.status === 'OPEN') {
            let currentInstructorId = sectionData.instructorId;
            if (currentInstructorId === undefined) { 
                const existingSection = await SectionRepo.findById(id);
                if (existingSection) {
                    currentInstructorId = existingSection.instructorId;
                }
            }

            if (!currentInstructorId) {
                 return NextResponse.json(
                    { 
                        error: "Cannot open section", 
                        details: "An instructor must be assigned to open a section for student registration." 
                    },
                    { status: 400 }
                );
            }
            console.log(`Section ${id}: Instructor ID ${currentInstructorId} is present. Proceeding to open section.`);
        }
        else {
             console.log(`Section ${id}: Updating section data (no specific status transition validation). Data:`, sectionData);
        }

        const updatedSection = await SectionRepo.update(id, sectionData);
        
        if (!updatedSection) {
             return NextResponse.json({ error: "Section not found for update" }, { status: 404 });
        }
        return NextResponse.json(updatedSection);

    } catch (error) {
        console.error("Error in PUT /api/sections/[id]:", error);s
        if (error instanceof TypeError && error.message.includes("is not a function")) {
             console.error("Specific TypeError for missing function detected. Ensure RegistrationRepo is correctly implemented and imported.");
             return NextResponse.json({ error: "Server configuration error", details: "A required function is missing." }, { status: 500 });
        }
        return NextResponse.json({ error: "Section update failed", details: error.message },
             { status: 500 });
    }
}

export async function DELETE(request, context) {
    try {
        const id = parseInt(context.params.id);
        const section = await SectionRepo.delete(id); 
        console.log(`Deleted section ${id}:`, section); 
        return NextResponse.json({ message: "Section deleted successfully", deletedSection: section });
    } catch (error) {
        console.error("Error in DELETE /api/sections/[id]:", error);
        return NextResponse.json({ error: "Section deletion failed", details: error.message },
             { status: 500 });
    }
}