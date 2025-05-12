import { PrismaClient } from '../../generated/prisma';

class SectionRepo {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.section.findMany({
            include: { sectionDays: true } 
        });
    }

    async findById(id) {
        return this.prisma.section.findUnique({ 
            where: { id: Number(id) },
            include: { sectionDays: true } 
        });
    }

    async create(sectionData) {
        const { Days, ...restOfSectionData } = sectionData; 
        if (restOfSectionData.courseId) restOfSectionData.courseId = Number(restOfSectionData.courseId);
        if (restOfSectionData.instructorId !== undefined && restOfSectionData.instructorId !== null) {
            restOfSectionData.instructorId = Number(restOfSectionData.instructorId);
        }
        if (restOfSectionData.capacity) restOfSectionData.capacity = Number(restOfSectionData.capacity);

        const createPayload = {
            ...restOfSectionData
        };

        if (Days && Array.isArray(Days) && Days.length > 0) {
            createPayload.sectionDays = {
                create: Days.map(dayString => ({ day: dayString }))
            };
        }

        return this.prisma.section.create({ 
            data: createPayload,
            include: { sectionDays: true } 
        });
    }

    async update(id, sectionData) {
        const { Days, ...restOfSectionData } = sectionData;
        const sectionId = Number(id);

        
        if (restOfSectionData.courseId) restOfSectionData.courseId = Number(restOfSectionData.courseId);
        
        if (restOfSectionData.instructorId !== undefined) {
             restOfSectionData.instructorId = restOfSectionData.instructorId === null ? null : Number(restOfSectionData.instructorId);
        }
        if (restOfSectionData.capacity) restOfSectionData.capacity = Number(restOfSectionData.capacity);


        const updatePayload = { ...restOfSectionData };

        if (Days && Array.isArray(Days)) { 
            await this.prisma.sectionDay.deleteMany({
                where: { sectionId: sectionId }
            });
            if (Days.length > 0) {
                updatePayload.sectionDays = {
                    create: Days.map(dayString => ({ day: dayString }))
                };
            }
        }
        return this.prisma.section.update({ 
            where: { id: sectionId }, 
            data: updatePayload,
            include: { sectionDays: true }  });
    }

    async delete(id) {
        const sectionId = Number(id);
        
        return this.prisma.section.delete({ 
            where: { id: sectionId } 
        });
    }

    
    async getSectionsByCourseId(courseId) {
        return this.prisma.section.findMany({ 
            where: { courseId: Number(courseId) },
            include: { sectionDays: true } 
        });
    }

    async getSectionsBySemester(semester) {
        return this.prisma.section.findMany({ 
            where: { semester: semester },
            include: { sectionDays: true } 
        });
    }

    async getSectionsByInstructorId(instructorId) {
        return this.prisma.section.findMany({ 
            where: { instructorId: Number(instructorId) },
            include: { sectionDays: true } 
        });
    }

    async getSectionsByCourseIdAndSemester(courseId, semester) {
        return this.prisma.section.findMany({ 
            where: { courseId: Number(courseId), semester: semester },
            include: { sectionDays: true } 
        });
    }

    async getSectionsByCourseIdAndInstructorId(courseId, instructorId) {
        return this.prisma.section.findMany({ where: { courseId: Number(courseId), instructorId: Number(instructorId) } });
    }

    async getSectionsByStatus(status) {
        return this.prisma.section.findMany({ 
            where: { status: status },
            include: { sectionDays: true }
        });
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
       
        const sectionsWithRegistrationCounts = await this.prisma.section.findMany({
            select: {
                semester: true,
                _count: {
                    select: { registrations: true } 
                }
            }
        });

        
        const semesterCounts = {};
        for (const section of sectionsWithRegistrationCounts) {
            const semester = section.semester;
            const count = section._count.registrations; 
            if (semesterCounts[semester] === undefined) {
                semesterCounts[semester] = 0;
            }
           
            semesterCounts[semester] += count;
        }

        
        let mostRegisteredSemester = null;
        let maxCount = -1;

        for (const semester in semesterCounts) {
            if (semesterCounts[semester] > maxCount) {
                maxCount = semesterCounts[semester];
                mostRegisteredSemester = semester;
            }
        }

        
        if (mostRegisteredSemester !== null) {
            
            return [{ semester: mostRegisteredSemester, count: maxCount }];
        } else {
            return []; 
        }
    }
}

const sectionRepoInstance = new SectionRepo();
export default sectionRepoInstance;
