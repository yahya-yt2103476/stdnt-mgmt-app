import { PrismaClient } from '../../generated/prisma';

class PublishedCourseRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.publishedCourse.findMany();
    }

    async findById(id) {
        return this.prisma.publishedCourse.findUnique({
            where: { id: Number(id) }
        })
    }

    async create(publishedCourseData) {
        return this.prisma.publishedCourse.create({
            data: publishedCourseData
        })
    }
    
    async update(id, publishedCourseData) {
        return this.prisma.publishedCourse.update({
            where: { id: Number(id) },
            data: publishedCourseData
        })
    }

    async delete(id) {
        return this.prisma.publishedCourse.delete({
            where: { id: Number(id) }
        })
    }   
    
    async getPublishedCoursesBySemester(semester) {
        return this.prisma.publishedCourse.findMany({
            where: { semester: semester }
        })
    }  

}

export default new PublishedCourseRepo();
