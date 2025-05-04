import { PrismaClient } from '../../generated/prisma';


class CourseRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.course.findMany();
    }

    async findById(id) {
        return this.prisma.course.findUnique({
            where: { id: Number(id)}
        })
    }
    
    async create(courseData) {
        return this.prisma.course.create({
            data: courseData
        })
    }
    
    async update(id, courseData) {
        return this.prisma.course.update({
            where: { id: Number(id)},
            data: courseData
        })
    }

    async delete(id) {
        return this.prisma.course.delete({
            where: { id: Number(id)}
        })
    }
    
    async findByCategory(category) {
        return this.prisma.course.findMany({
            where: { category: category}
        })
    }

    async getTotalCoursesByCategory(category) {
        return this.prisma.course.count({
            where: { category: category}
        })
    }
    
    async findByShortName(shortName) {
        return this.prisma.course.findUnique({
            where: { shortName: shortName}
        })
    }

    async getTotalCourses() {
        return this.prisma.course.count();
    }

    async getLastAddedCourse() {
        return this.prisma.course.findFirst({
            orderBy: {
                id: 'desc'
            }
        })
    }

    async getCourseWithHighestFailureRate() {

        const registrations = await this.prisma.registration.findMany({
            where: {
                grade: { not: null }
            },
            include: {
                section: {
                    include: {
                        course: true
                    }
                }
            }
        });

        const courseStats = {};
        
        registrations.forEach(reg => {
            const courseId = reg.section.course.id;
            
            if (!courseStats[courseId]) {
                courseStats[courseId] = {
                    courseId,
                    courseName: reg.section.course.name,
                    totalStudents: 0,
                    failedStudents: 0
                };
            }
            
            courseStats[courseId].totalStudents++;
            
            // Assume grades below 'D' or 'F' are failing grades
            if (reg.grade === 'F' || reg.grade === 'E') {
                courseStats[courseId].failedStudents++;
            }
        });
        
        let highestFailureRate = 0;
        let courseWithHighestFailureRate = null;
        
        Object.values(courseStats).forEach(stats => {
            if (stats.totalStudents > 0) {
                const failureRate = stats.failedStudents / stats.totalStudents;
                stats.failureRate = failureRate;
                
                if (failureRate > highestFailureRate) {
                    highestFailureRate = failureRate;
                    courseWithHighestFailureRate = stats;
                }
            }
        });
        
        if (courseWithHighestFailureRate) {
            return this.prisma.course.findUnique({
                where: {
                    id: courseWithHighestFailureRate.courseId
                }
            });
        }
        
        return null;
    }

    async getCourseWithMostPrerequisites() {
        const courses = await this.prisma.course.findMany({
            include: {
                prerequisites: true
            }
        })

        const courseWithMostPrerequisites = courses.reduce((maxCourse, currentCourse) => {
            return currentCourse.prerequisites.length > maxCourse.prerequisites.length ? currentCourse : maxCourse;
        }, courses[0]);

        return courseWithMostPrerequisites;
    }

    async getMostRegisteredCourse() {
        // Get all courses with their registrations
        const coursesWithRegistrations = await this.prisma.course.findMany({
            include: {
                sections: {
                    include: {
                        registrations: true
                    }
                }
            }
        });

        // Calculate total registrations per course
        let maxRegistrations = 0;
        let mostRegisteredCourse = null;

        coursesWithRegistrations.forEach(course => {
            const totalRegistrations = course.sections.reduce((sum, section) => {
                return sum + section.registrations.length;
            }, 0);

            if (totalRegistrations > maxRegistrations) {
                maxRegistrations = totalRegistrations;
                mostRegisteredCourse = course;
            }
        });

        return mostRegisteredCourse;
    }
        
}

export default CourseRepo;