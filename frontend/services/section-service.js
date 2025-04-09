import { fetchDataFromApi, saveDataToApi, deleteDataFromApi } from './api-service.js';

async function createSection(data) {
  const newSection = {
    courseId: data.courseId,
    courseShortName: data.courseShortName,
    instructorName: data.instructorName,
    capacity: data.capacity || 30,
    enrolledStudents: data.enrolledStudents || [],
    status: data.status || 'open',
    semester: data.semester,
    Time: data.Time,
    Days: data.Days || [],
    location: data.location,
    courseContent: data.courseContent || []
  };
  
  return await saveDataToApi('/sections', newSection);
}

async function addStudentToSection(sectionId, studentId) {
  const section = await fetchSectionById(sectionId);
  if (section) {
    section.enrolledStudents.push(parseInt(studentId));
    return await saveDataToApi('/sections', section);
  }
  throw new Error('Section not found');
  
  
}

async function updateSection(sectionId, data) {
  const updatedSection = {
    id: sectionId,
    courseId: data.courseId,
    courseShortName: data.courseShortName,
    instructorName: data.instructorName,
    capacity: data.capacity || 30,
    enrolledStudents: data.enrolledStudents || [],
    status: data.status || 'open',
    semester: data.semester,
    Time: data.Time,
    Days: data.Days || [],
    location: data.location,
    courseContent: data.courseContent || []
  };
  
  return await saveDataToApi('/sections', updatedSection);
}

async function fetchAllSections() {
  const response = await fetchDataFromApi('/sections');
  return response || [];
}

async function fetchSectionById(sectionId) {
  const response = await fetchDataFromApi(`/sections/${sectionId}`);
  return response || null;
}

async function fetchSectionsByCourseId(courseId) {
  const response = await fetchDataFromApi(`/sections/course/${courseId}`);
  return response || [];
}

async function fetchSectionsBySemester(semester) {
  const response = await fetchDataFromApi(`/sections/semester/${semester}`);
  return response || [];
}

async function deleteSectionById(sectionId) {
  return await deleteDataFromApi(`/sections/${sectionId}`);
}

export { 
  createSection,
  updateSection,
  fetchAllSections, 
  fetchSectionById, 
  fetchSectionsByCourseId,
  fetchSectionsBySemester,
  deleteSectionById,
  addStudentToSection
}; 