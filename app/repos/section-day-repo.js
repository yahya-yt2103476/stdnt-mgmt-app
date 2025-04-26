import { PrismaClient } from '../../generated/prisma';

class SectionDayRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.sectionDay.findMany();
    }

    async findById(id) {
        return this.prisma.sectionDay.findUnique({ where: { id: Number(id) } });
    }
    
    async create(sectionDayData) {
        return this.prisma.sectionDay.create({ data: sectionDayData });
    }

    async update(id, sectionDayData) {
        return this.prisma.sectionDay.update({ where: { id: Number(id) }, data: sectionDayData });
    }

    async delete(id) {
        return this.prisma.sectionDay.delete({ where: { id: Number(id) } });
    }
}

export default new SectionDayRepo();




