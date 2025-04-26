import fs from 'fs-extra';
import path from 'path';

class coursesRepo {
    constructor(parameters) {
        this.CoursesFilePath = path.join(process.cwd(), "backend/database/courses.json")
    }

    //get all courses
    async GetCourses() {
        const courses = await fs.readJSON(this.CoursesFilePath);
        return courses;
    }

    //Get A specific Course. Pass the course id.
    async GetCourse(courseID) {
        const couID = parseInt(courseID);
        const courses = await this.GetCourses();

        const DesiredCourse = courses.find((course) => course.id == couID);
        if (DesiredCourse != null) {
            return DesiredCourse;
        } else {
            return "No course with specified Id"
        }
    }

    async CreateCourse(newCourse) {
        const courses = await this.GetCourses();
        
        // Find the maximum id to assign a new id
        const maxId = courses.reduce((max, course) => Math.max(max, course.id), 0);
        newCourse.id = maxId + 1;
        
        courses.push(newCourse);
        await fs.writeJSON(this.CoursesFilePath, courses);
        return newCourse;
    }

    async UpdateCourse(updatedCourse) {
        const courses = await this.GetCourses();
        const DesiredCourseIndex = courses.findIndex((course) => course.id == updatedCourse.id);
        
        console.log('Updating course - ID:', updatedCourse.id);
        console.log('Found at index:', DesiredCourseIndex);
        console.log('Course data:', updatedCourse);

        if (DesiredCourseIndex !== -1) {
            courses.splice(DesiredCourseIndex, 1)
            courses.push(updatedCourse)
            await fs.writeJSON(this.CoursesFilePath, courses)
            console.log('Course updated successfully');
            return updatedCourse
        } else {
            console.log('No course found with ID:', updatedCourse.id);
            return null
        }
    }

    //Delete a Course entirly. Pass the course Id
    async DeleteCourse(courseID) {
        const courses = await this.GetCourses()
        const DesiredCourseIndex = courses.findIndex((course) => course.id == courseID);

        if (DesiredCourseIndex != null) {
            courses.splice(DesiredCourseIndex, 1)
            await fs.writeJSON(this.CoursesFilePath, courses)
            return "course deleted Successfully"
        } else {
            return "No course with specified Id"
        }
    }
}

export default new coursesRepo();