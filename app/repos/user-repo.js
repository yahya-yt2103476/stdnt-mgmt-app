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

  async findUserByEmailAndPassword(email, password, usertype) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) return null;
  
    // no use of hashing passwords and comparing them. i removed it for testing purposes.
    //
    if (user.password !== password) return null;
  
    if (user.userType !== usertype) return null;
  
    return user;
  }
}

export default UserRepo;
