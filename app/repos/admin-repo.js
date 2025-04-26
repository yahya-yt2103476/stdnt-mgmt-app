import { PrismaClient } from '../../generated/prisma';

class AdminRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.admin.findMany();
    }

    async findById(id) {
        return this.prisma.admin.findUnique({
            where: { id: Number(id) }
        })
    }

    async create(adminData) {
        return this.prisma.admin.create({
            data: adminData
        })
    }

    async update(id, adminData) {
        return this.prisma.admin.update({
            where: { id: Number(id) },
            data: adminData
        })
    }

    async delete(id) {
        return this.prisma.admin.delete({
            where: { id: Number(id) }
        })
    }
}

export default AdminRepo;

