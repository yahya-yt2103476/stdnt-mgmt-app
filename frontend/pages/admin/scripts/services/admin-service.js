import { Course } from '../../../../backend/Entities/course.js';

class CourseService {

    constructor() {
        this.courses = [];
    }

    async loadCourses() {
        try {
            
            let coursesLink = "http://127.0.0.1:5500/database/courses.json";

            const response = await fetch(coursesLink);
            const coursesData = await response.json();
            

            this.courses = coursesData.map(course => 
                new Course(
                    course.id,
                    course.name,
                    course.category,
                    course.prerequisites
                )
            );
            
            return this.courses;
        } catch (error) {
            console.error('Error loading courses:', error);
            throw error;
        }
    }

    getAllCourses() {
        return this.courses;
    }

    getCourseById(courseId) {
        return this.courses.find(course => course.id === courseId);
    }

    getCoursesByCategory(category) {
        return this.courses.filter(course => course.category === category);
    }
}

export const courseService = new CourseService();
