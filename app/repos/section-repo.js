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

    async getSectionsStatusDistribution() {
        return this.prisma.section.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        })
    }

    async getMostRegisteredSemester() {
        // 1. Fetch all sections, including their semester and a count of related registrations
        const sectionsWithRegistrationCounts = await this.prisma.section.findMany({
            select: {
                semester: true,
                _count: {
                    select: { registrations: true } // Get registration count per section
                }
            }
        });

        // 2. Aggregate registration counts per semester in JavaScript
        const semesterCounts = {};
        for (const section of sectionsWithRegistrationCounts) {
            const semester = section.semester;
            const count = section._count.registrations; // Get the count for this section

            // Initialize count for the semester if it's the first time seeing it
            if (semesterCounts[semester] === undefined) {
                semesterCounts[semester] = 0;
            }
            // Add the section's registration count to the semester's total
            semesterCounts[semester] += count;
        }

        // 3. Find the semester with the highest total count
        let mostRegisteredSemester = null;
        let maxCount = -1;

        for (const semester in semesterCounts) {
            if (semesterCounts[semester] > maxCount) {
                maxCount = semesterCounts[semester];
                mostRegisteredSemester = semester;
            }
        }

        // 4. Format and return the result
        if (mostRegisteredSemester !== null) {
            // Return in a similar structure to groupBy for consistency, if desired
            return [{ semester: mostRegisteredSemester, count: maxCount }];
        } else {
            return []; // Return empty array if no sections/registrations found
        }
    }
}

export default new SectionRepo();
