import { PrismaClient } from '../../generated/prisma';

class PublishedCourseRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        const courses = await this.prisma.publishedCourse.findMany();
        return courses.map(course => ({
            ...course,
            interestedInstructorIds: JSON.parse(course.interestedInstructorIds || "[]")
        }));
    }

    async findById(id) {
        const course = await this.prisma.publishedCourse.findUnique({
            where: { id: Number(id) }
        });
        if (course) {
            return {
                ...course,
                interestedInstructorIds: JSON.parse(course.interestedInstructorIds || "[]")
            };
        }
        return null;
    }

    async create(publishedCourseData) {
        const dataToCreate = { ...publishedCourseData };
        if (Array.isArray(dataToCreate.interestedInstructorIds)) {
            dataToCreate.interestedInstructorIds = JSON.stringify(dataToCreate.interestedInstructorIds);
        } else if (dataToCreate.interestedInstructorIds === undefined || dataToCreate.interestedInstructorIds === null) {
            dataToCreate.interestedInstructorIds = "[]";
        }
        if (typeof dataToCreate.interestedInstructorIds !== 'string') {
             dataToCreate.interestedInstructorIds = JSON.stringify(dataToCreate.interestedInstructorIds || []);
        }


        return this.prisma.publishedCourse.create({
            data: dataToCreate
        }).then(course => ({ 
            ...course,
            interestedInstructorIds: JSON.parse(course.interestedInstructorIds || "[]")
        }));
    }
    
    async update(id, publishedCourseData) {
        const dataToUpdate = { ...publishedCourseData };
        
        
        if (dataToUpdate.hasOwnProperty('id')) {
            delete dataToUpdate.id;
        }
        if (dataToUpdate.hasOwnProperty('courseId') && publishedCourseData.course) { 
             delete dataToUpdate.courseId; 
        }


        if (Array.isArray(dataToUpdate.interestedInstructorIds)) {
            dataToUpdate.interestedInstructorIds = JSON.stringify(dataToUpdate.interestedInstructorIds);
        } else if (dataToUpdate.interestedInstructorIds === undefined && publishedCourseData.interestedInstructorIds === undefined) {
           //Todo: handle this case
        } else if (dataToUpdate.interestedInstructorIds === null) {
             dataToUpdate.interestedInstructorIds = "[]";
        }
        if (dataToUpdate.interestedInstructorIds !== undefined && typeof dataToUpdate.interestedInstructorIds !== 'string') {
             dataToUpdate.interestedInstructorIds = JSON.stringify(dataToUpdate.interestedInstructorIds || []);
        }


        return this.prisma.publishedCourse.update({
            where: { id: Number(id) },
            data: dataToUpdate
        }).then(course => ({ 
            ...course,
            interestedInstructorIds: JSON.parse(course.interestedInstructorIds || "[]")
        }));
    }

    async delete(id) {
        return this.prisma.publishedCourse.delete({
            where: { id: Number(id) }
        });
    }   
    
    async getPublishedCoursesBySemester(semester) {
        const courses = await this.prisma.publishedCourse.findMany({
            where: { semester: semester }
        });
        
        return courses.map(course => ({
            ...course,
            interestedInstructorIds: JSON.parse(course.interestedInstructorIds || "[]")
        }));
    }  
}

const publishedCourseRepoInstance = new PublishedCourseRepo();
export default publishedCourseRepoInstance;
