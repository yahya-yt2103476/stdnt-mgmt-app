import { PrismaClient } from "../../generated/prisma";

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
    return this.prisma.registration.update({
      where: { id: Number(id) },
      data: registrationData,
    });
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
            course: true,
          },
        },
      },
    });
  }

  //   async getMostRegisteredSemester() {
  //     return this.prisma.registration.groupBy({
  //       by: ["section.semester"],
  //       include: {
  //         section: true,
  //       },
  //       _count: {
  //         section: true,
  //       },
  //       orderBy: {
  //         _count: "desc",
  //       },
  //     });
  //   }
  async getMostRegisteredSemester() {
    const data = await this.prisma.section.groupBy({
      by: ["semester"],
      _count: {
        registrations: true,
      },
      orderBy: {
        _count: {
          registrations: "desc",
        },
      },
    });

    return data.map((item) => ({
      semester: item.semester,
      count: item._count.registrations,
    }));
  }
}

export default new RegistrationRepo();
