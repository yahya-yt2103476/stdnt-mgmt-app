import { PrismaClient } from '../../generated/prisma';

class SectionRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.section.findMany();
    }

    async findById(id) {
        return this.prisma.section.findUnique({ where: { id } });
    }

    async create(sectionData) {
        return this.prisma.section.create({ data: sectionData });
    }

    async update(id, sectionData) {
        return this.prisma.section.update({ where: { id }, data: sectionData });
    }

    async delete(id) {
        return this.prisma.section.delete({ where: { id } });
    }

    async getSectionsByCourseId(courseId) {
        return this.prisma.section.findMany({ where: { courseId: Number(courseId) } });
    }

    async getSectionsBySemester(semester) {
        return this.prisma.section.findMany({ where: { semester: semester } });
    }

    async getSectionsByInstructorId(instructorId) {
        return this.prisma.section.findMany({ where: { instructorId: Number(instructorId) } });
    }

    async getSectionsByCourseIdAndSemester(courseId, semester) {
        return this.prisma.section.findMany({ where: { courseId: Number(courseId), semester: semester } });
    }

    async getSectionsByCourseIdAndInstructorId(courseId, instructorId) {
        return this.prisma.section.findMany({ where: { courseId: Number(courseId), instructorId: Number(instructorId) } });
    }

    async getSectionsByStatus(status) {
        return this.prisma.section.findMany({ where: { status: status } });
    }

    async getSectionsByLocation(location) {
        return this.prisma.section.findMany({ where: { location: location } });
    }

    async getSectionsByTime(time) {
        return this.prisma.section.findMany({ where: { time: time } });
    }
}

export default new SectionRepo();
