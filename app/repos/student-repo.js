import { PrismaClient } from '../../generated/prisma';

class StudentRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.student.findMany();
    }

    async findById(id) {
        return this.prisma.student.findUnique({
            where: { id: Number(id)}
        })
    }

    async create(studentData) {
        return this.prisma.student.create({
            data: studentData
        })
    }

    async update(id, studentData) {
        return this.prisma.student.update({
            where: { id: Number(id)},
            data: studentData
        })
    }

    async delete(id) {
        return this.prisma.student.delete({
            where: { id: Number(id)}
        })
    }
    
}

export default StudentRepo;