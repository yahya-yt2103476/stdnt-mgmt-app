import { PrismaClient } from '../../generated/prisma';

class CompletedCourseRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.completedCourse.findMany();
    }

    async findById(id) {
        return this.prisma.completedCourse.findUnique({ where: { id: Number(id) } });
    }

    async create(completedCourseData) {
        return this.prisma.completedCourse.create({ data: completedCourseData });
    }

    async update(id, completedCourseData) {
        return this.prisma.completedCourse.update({ where: { id: Number(id) }, data: completedCourseData });
    }

    async delete(id) {
        return this.prisma.completedCourse.delete({ where: { id: Number(id) } });
    }
}

export default new CompletedCourseRepo();

