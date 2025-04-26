import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readJsonFile(filename) {
  const filePath = path.join(__dirname, '../backend/database', filename);
  const data = await fs.readJSON(filePath);
  return data;
}

async function main() {
  try {
    console.log('Starting database seeding...');

    // Read all JSON files
    const users = await readJsonFile('users.json');
    const admins = await readJsonFile('admins.json');
    const instructors = await readJsonFile('instructors.json');
    const students = await readJsonFile('students.json');
    const categories = await readJsonFile('categories.json');
    const courses = await readJsonFile('courses.json');
    const coursePrerequisites = await readJsonFile('course-prerequisites.json');
    const sections = await readJsonFile('sections.json');
    const sectionDays = await readJsonFile('section-days.json');
    const registrations = await readJsonFile('registrations.json');
    const publishedCourses = await readJsonFile('published-courses.json');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.$transaction([
      prisma.completedCourse.deleteMany(),
      prisma.registration.deleteMany(),
      prisma.sectionDay.deleteMany(),
      prisma.section.deleteMany(),
      prisma.publishedCourse.deleteMany(),
      prisma.coursePrerequisite.deleteMany(),
      prisma.course.deleteMany(),
      prisma.category.deleteMany(),
      prisma.student.deleteMany(),
      prisma.instructor.deleteMany(),
      prisma.admin.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Seed users
    console.log('Seeding users...');
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          userType: user.userType,
        },
      });
    }

    // Seed admins
    console.log('Seeding admins...');
    for (const admin of admins) {
      await prisma.admin.create({
        data: {
          id: admin.id,
          name: admin.name,
          userId: admin.userId,
        },
      });
    }

    // Seed instructors
    console.log('Seeding instructors...');
    for (const instructor of instructors) {
      await prisma.instructor.create({
        data: {
          id: instructor.id,
          name: instructor.name,
          userId: instructor.userId,
        },
      });
    }

    // Seed students
    console.log('Seeding students...');
    for (const student of students) {
      await prisma.student.create({
        data: {
          id: student.id,
          name: student.name,
          major: student.major,
          gpa: student.gpa,
          userId: student.userId,
        },
      });
    }

    // Seed categories
    console.log('Seeding categories...');
    for (const category of categories) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
        },
      });
    }

    // Seed courses
    console.log('Seeding courses...');
    for (const course of courses) {
      await prisma.course.create({
        data: {
          id: course.id,
          shortName: course.shortName,
          name: course.name,
          description: course.description,
          creditHours: course.creditHours,
          category: course.category,
        },
      });
    }

    // Seed course prerequisites
    console.log('Seeding course prerequisites...');
    for (const prerequisite of coursePrerequisites) {
      await prisma.coursePrerequisite.create({
        data: {
          id: prerequisite.id,
          courseId: prerequisite.courseId,
          prerequisiteId: prerequisite.prerequisiteId,
        },
      });
    }

    // Seed sections
    console.log('Seeding sections...');
    for (const section of sections) {
      await prisma.section.create({
        data: {
          id: section.id,
          courseId: section.courseId,
          instructorId: section.instructorId,
          capacity: section.capacity,
          status: section.status,
          semester: section.semester,
          time: section.time,
          location: section.location,
          courseContent: section.courseContent,
        },
      });
    }

    // Seed section days
    console.log('Seeding section days...');
    for (const sectionDay of sectionDays) {
      await prisma.sectionDay.create({
        data: {
          id: sectionDay.id,
          sectionId: sectionDay.sectionId,
          day: sectionDay.day,
        },
      });
    }

    // Seed registrations
    console.log('Seeding registrations...');
    for (const registration of registrations) {
      await prisma.registration.create({
        data: {
          id: registration.id,
          studentId: registration.studentId,
          sectionId: registration.sectionId,
          grade: registration.grade,
          status: registration.status,
        },
      });
    }

    // Seed published courses
    console.log('Seeding published courses...');
    for (const publishedCourse of publishedCourses) {
      await prisma.publishedCourse.create({
        data: {
          id: publishedCourse.id,
          courseId: publishedCourse.courseId,
          semester: publishedCourse.semester,
          publishedDate: new Date(publishedCourse.publishedDate),
          submissionDeadline: publishedCourse.submissionDeadline 
            ? new Date(publishedCourse.submissionDeadline) 
            : null,
        },
      });
    }

    // Seed completed courses if they exist in the students data
    console.log('Seeding completed courses...');
    for (const student of students) {
      if (student.completedCourses && student.completedCourses.length > 0) {
        for (const completedCourse of student.completedCourses) {
          await prisma.completedCourse.create({
            data: {
              studentId: student.id,
              courseId: completedCourse.courseId,
              grade: completedCourse.grade || null,
            },
          });
        }
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
