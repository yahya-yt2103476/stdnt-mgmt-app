import fs from 'fs-extra';
import path from 'path';

class publishedCoursesRepo {
    constructor(parameters) {
        this.publishedCourseFilePath = path.join(process.cwd(), "backend/database/published-courses.json")
    }

    async getAllPublishedCourses() {
        const publishedCourses = await fs.readJSON(this.publishedCourseFilePath);
        return publishedCourses;
    }
    //Get A specific Course. Pass the course id.
    async getPublishedCourse(courseID) {
        const courseIDParsed = parseInt(courseID);
        const publishedCourses = await this.getAllPublishedCourses();

        const desiredCourse = publishedCourses.find((course) => course.id == courseIDParsed);
        if (desiredCourse != null) {
            return desiredCourse;
        } else {
            return "No course with specified Id"
        }
    }
    //create a new course
    async createPublishedCourse(courseData) {
        const publishedCourses = await this.getAllPublishedCourses();
        publishedCourses.push(courseData);
        await fs.writeJSON(this.publishedCourseFilePath, publishedCourses);
        return "Course Created Successfully"
    }
    //update a course
    async updatePublishedCourse(courseData) {
        const publishedCourses = await this.getAllPublishedCourses();
        const desiredCourseIndex = publishedCourses.findIndex((course) => course.id == courseData.id);

        if (desiredCourseIndex != null) {
            publishedCourses.splice(desiredCourseIndex, 1)
            publishedCourses.push(courseData)
            await fs.writeJSON(this.publishedCourseFilePath, publishedCourses)
            return "Course updated Successfully"
        } else {
            return "No course with specified Id"
        }
    }
    //Delete a Course entirly. Pass the course Id
    async deletePublishedCourse(courseID) {
        const publishedCourses = await this.getAllPublishedCourses()
        const desiredCourseIndex = publishedCourses.findIndex((course) => course.id == courseID);

        if (desiredCourseIndex != null) {
            publishedCourses.splice(desiredCourseIndex, 1)
            await fs.writeJSON(this.publishedCourseFilePath, publishedCourses)
            return "Course deleted Successfully"
        } else {
            return "No course with specified Id"
        }
    }
}

export default new publishedCoursesRepo();