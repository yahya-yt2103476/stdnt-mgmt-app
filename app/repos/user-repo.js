import { PrismaClient } from '../../generated/prisma';

class UserRepo {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id) {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        admin: true,
        instructor: true,
        student: true
      }
    });
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        instructor: true,
        student: true
      }
    });
  }

  async create(userData) {
    return this.prisma.user.create({
      data: userData
    });
  }

  async update(id, userData) {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: userData
    });
  }

  async delete(id) {
    return this.prisma.user.delete({
      where: { id: Number(id) }
    });
  }
}

export default UserRepo;
