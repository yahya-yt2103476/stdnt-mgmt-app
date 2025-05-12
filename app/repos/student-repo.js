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

    async findByUserId(userId) {
        console.log(`Repo: Searching for student with userId: ${userId} (Type: ${typeof userId})`);
        const student = await this.prisma.student.findUnique({
            where: { userId: Number(userId) },
            include: {
            }
        });
        console.log(`Repo: Found student:`, student);
        return student;
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

    async getTotalStudents() {
        return this.prisma.student.count();
    }

    async getAverageStudentsGPA() {
        const result = await this.prisma.student.aggregate({
            _avg: {
                gpa: true
            }
        });
        return result._avg.gpa || 0;
    }

    async getAverageStudentsCoursesCount() {
        const totalStudents = await this.prisma.student.count();
        if (totalStudents === 0) {
            return 0; // Avoid division by zero if there are no students
        }
        
        const totalCompletedCourses = await this.prisma.completedCourse.count();
        
        return totalCompletedCourses / totalStudents;
    }
    
}

export default StudentRepo;