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
    
    async findByShortName(shortName) {
        return this.prisma.course.findUnique({
            where: { shortName: shortName}
        })
    }
    
}

export default CourseRepo;