import { PrismaClient } from '../../generated/prisma';

class CoursePrerequisiteRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.coursePrerequisite.findMany();
    }

    async findById(id) {
        return this.prisma.coursePrerequisite.findUnique({ where: { id: Number(id) } });
    }

    async create(coursePrerequisiteData) {
        return this.prisma.coursePrerequisite.create({ data: coursePrerequisiteData });
    }

    async update(id, coursePrerequisiteData) {
        return this.prisma.coursePrerequisite.update({ where: { id: Number(id) }, data: coursePrerequisiteData });
    }

    async delete(id) {
        return this.prisma.coursePrerequisite.delete({ where: { id: Number(id) } });
    }
    
}

export default new CoursePrerequisiteRepo();
