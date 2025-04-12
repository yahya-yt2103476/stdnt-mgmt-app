import { fetchDataFromApi, deleteDataFromApi,saveDataToApi } from "./api-service.js";


//fetch all published courses
async function fetchAllPublishedCourses() {
    const response = await fetchDataFromApi("/publishedCourses");
    return response || [];
    }

//fetch a specific published course by its ID    
async function fetchPublishedCourse(courseId) {
    const response = await fetchDataFromApi(`/publishedCourses/${courseId}`);
    return response ;
    }   

//create a new published course
async function createPublishedCourse(data) {
    const publishedCourses = await fetchAllPublishedCourses();
    const maxId = publishedCourses.reduce((max, course) => Math.max(max, course.id), 0);

    const newCourse = {
        id: maxId + 1,
        ...data,
    };

    return await saveDataToApi("/publishedCourses", newCourse);
}    

//delete a published course by its ID
async function deletePublishedCourse(courseId) {
    return await deleteDataFromApi(`/publishedCourses/${courseId}`);
    
}
    
//update a published course, send the course object
async function updatePublishedCourse(courseData) {
    if (!courseData.id) {
        throw new Error("Course ID is required for updating");
    }

    return await saveDataToApi(`/publishedCourses`, courseData, "PUT");
}

//export all functions
export { fetchAllPublishedCourses, fetchPublishedCourse, createPublishedCourse, deletePublishedCourse, updatePublishedCourse };