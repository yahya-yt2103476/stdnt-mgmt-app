import { PrismaClient } from '../../generated/prisma';

class RegistrationRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.registration.findMany();
    }

    async findById(id) {
        return this.prisma.registration.findUnique({ where: { id: Number(id) } });
    }

    async create(registrationData) {
        return this.prisma.registration.create({ data: registrationData });
    }

    async update(id, registrationData) {
        return this.prisma.registration.update({ where: { id: Number(id) }, data: registrationData });
    }

    async delete(id) {
        return this.prisma.registration.delete({ where: { id: Number(id) } });
    }

    async getRegistrationsByStudentId(studentId) {
        return this.prisma.registration.findMany({
            where: { studentId: Number(studentId) },
            include: {
                section: {
                    include: {
                        course: true
                    }
                }
            }
        });
    }

    async getMostRegisteredSemester() {
        return this.prisma.registration.groupBy({
            by: ['section.semester'],
            include: {
                section: true
            },
            _count: {
                section: true
            },
            orderBy: {
                _count: 'desc'
            }
        })
    }
}

export default new RegistrationRepo();
