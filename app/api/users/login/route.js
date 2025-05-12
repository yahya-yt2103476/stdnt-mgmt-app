import { NextResponse } from 'next/server';
import UserRepo from "../../../repos/user-repo";
import StudentRepo from "../../../repos/student-repo";
import InstructorRepo from "../../../repos/instructor-repo";
import AdminRepo from "../../../repos/admin-repo";

const userRepo = new UserRepo();
const studentRepo = new StudentRepo();
const instructorRepo = new InstructorRepo();
const adminRepo = new AdminRepo();

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, userType } = body;

        if (!email || !password || !userType) {
            return NextResponse.json(
                { error: 'Email, password, and user type are required' },
                { status: 400 }
            );
        }

        const user = await userRepo.findByEmail(email);

        if (!user) {
            console.log(`Login attempt failed: User not found for email ${email}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const passwordMatch = user.password === password;
        const userTypeMatch = user.userType.toUpperCase() === userType.toUpperCase();

        if (passwordMatch && userTypeMatch) {
            let profile = null;
            try {
                switch (user.userType.toUpperCase()) {
                    case 'STUDENT':
                        profile = await studentRepo.findByUserId(user.id);
                        break;
                    case 'INSTRUCTOR':
                        profile = await instructorRepo.findByUserId(user.id);
                        break;
                    case 'ADMIN':
                        profile = await adminRepo.findByUserId(user.id);
                        break;
                    default:
                        // This case should ideally not be reached if userType is validated
                        console.error(`Login error: Unknown user type for user ID ${user.id}: ${user.userType}`);
                        return NextResponse.json({ error: 'Login failed: Invalid user profile type' }, { status: 500 });
                }
            } catch (profileError) {
                console.error(`Login error: Failed to fetch profile for user ID ${user.id}, type ${user.userType}:`, profileError);
                return NextResponse.json({ error: 'Login failed: Could not retrieve user profile', details: profileError.message }, { status: 500 });
            }

            if (!profile) {
                console.log(`Login failed: Profile not found for user ID ${user.id}, type ${user.userType}`);
                return NextResponse.json({ error: 'Login failed: User profile not found.' }, { status: 401 });
            }
            
            // Exclude password from the main user object if it's still there by any chance
            // const { password: _, ...userSafe } = user;

            console.log(`Login successful for ${email}, User ID: ${user.id}, Profile Type: ${user.userType}`);
            // Return user ID, email, userType, and the specific profile
            return NextResponse.json({ 
                id: user.id, 
                email: user.email, 
                userType: user.userType,
                profile: profile // The fetched student, instructor, or admin object
            });

        } else {
            if (!passwordMatch) console.log(`Login attempt failed: Password mismatch for email ${email}`);
            if (!userTypeMatch) console.log(`Login attempt failed: User type mismatch for email ${email}. Expected ${user.userType}, got ${userType}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

    } catch (error) {   
        console.error('Login API error:', error);
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        );
    }
}