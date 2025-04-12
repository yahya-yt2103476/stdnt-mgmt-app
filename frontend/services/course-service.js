import {
  fetchDataFromApi,
  saveDataToApi,
  deleteDataFromApi,
} from "./api-service.js";

async function createCourse(data) {
  if (!data.category || !["programming", "math"].includes(data.category)) {
    throw new Error('Course category must be either "programming" or "math"');
  }

  const newCourse = {
    shortName: data.shortName,
    name: data.name,
    description: data.description,
    creditHours: data.creditHours || 3,
    category: data.category,
    prerequisites: data.prerequisites || [],
  };

  return await saveDataToApi("/courses", newCourse);
}

async function fetchAllCourses() {
  const response = await fetchDataFromApi("/courses");
  return response || [];
}

async function fetchCourseById(courseId) {
  const response = await fetchDataFromApi(`/courses/${courseId}`);
  return response || null;
}

async function deleteCourseById(courseId) {
  return await deleteDataFromApi(`/courses/${courseId}`);
}

async function updateCourse(courseData) {
  if (!courseData.id) {
    throw new Error("Course ID is required for updates");
  }

  if (
    !courseData.category ||
    ![
      "cybersecurity",
      "ai",
      "data Science",
      "math",
      "Physics",
      "programming",
    ].includes(courseData.category)
  ) {
    throw new Error(
      'Course category must be one of the following: "cybersecurity", "ai", "data science", "math", "physics", "programming"'
    );
  }

  const updatedCourse = {
    id: courseData.id,
    shortName: courseData.shortName,
    name: courseData.name,
    description: courseData.description,
    creditHours: courseData.creditHours || 3,
    category: courseData.category,
    prerequisites: courseData.prerequisites || [],
  };

  return await saveDataToApi(`/courses/${courseData.id}`, updatedCourse);
}

export {
  createCourse,
  fetchAllCourses,
  fetchCourseById,
  deleteCourseById,
  updateCourse,
};
