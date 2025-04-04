import fs from 'fs-extra';
import path from 'path';

class coursesRepo {
    constructor(parameters) {
        this.CoursesFilePath = path.join(process.cwd(), "database/courses.json")
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

    //Updating a Course Information. Pass the *Course Object*
    async UpdateCourse(course) {
        const courses = await this.GetCourses();
        const DesiredCourseIndex = courses.findIndex((course) => course.id == course.id);

        if (DesiredCourseIndex != null) {
            courses.splice(DesiredCourseIndex, 1)
            courses.push(course)
            await fs.writeJSON(this.CoursesFilePath, courses)
            return "course updated Successfully"
        } else {
            return "No course with specified Id"
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