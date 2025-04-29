'use server'

import CourseRepo from '../repos/course-repo';
import SectionRepo from '../repos/section-repo';
import RegistrationRepo from '../repos/registration-repo';
import StudentRepo from '../repos/student-repo';
import SectionDayRepo from '../repos/section-day-repo';

// Course actions
export async function createCourse(courseData) {
  const courseRepository = new CourseRepo();
  try {
    const newCourse = await courseRepository.create(courseData);
    return { success: true, data: newCourse };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Section actions
export async function createSection(sectionData) {
  try {
    const newSection = await SectionRepo.create(sectionData);
    return { success: true, data: newSection };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Add section days to a section
export async function createSectionDay(sectionDayData) {
  try {
    const newSectionDay = await SectionDayRepo.create(sectionDayData);
    return { success: true, data: newSectionDay };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Registration actions
export async function createRegistration(registrationData) {
  try {
    const newRegistration = await RegistrationRepo.create(registrationData);
    return { success: true, data: newRegistration };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Student actions
export async function createStudent(studentData) {
  const studentRepository = new StudentRepo();
  try {
    const newStudent = await studentRepository.create(studentData);
    return { success: true, data: newStudent };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
