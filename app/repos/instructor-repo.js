import { PrismaClient } from '../../generated/prisma';

class InstructorRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.instructor.findMany();
    }

    async findById(id) {
        return this.prisma.instructor.findUnique({
            where: { id: Number(id) }
        })
    }

    async findByUserId(userId) {
        return this.prisma.instructor.findUnique({
            where: { userId: Number(userId) }
        });
    }

    async create(instructorData) {
        return this.prisma.instructor.create({
            data: instructorData
        })
    }

    async update(id, instructorData) {
        return this.prisma.instructor.update({
            where: { id: Number(id) },
            data: instructorData
        })
    }

    async delete(id) {
        return this.prisma.instructor.delete({
            where: { id: Number(id) }
        })
    }

    async getTotalInstructors() {
        return this.prisma.instructor.count();
    }
}

export default InstructorRepo;
