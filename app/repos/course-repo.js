import { PrismaClient } from "../../generated/prisma";

class CourseRepo {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    // Fetch courses and include related CoursePrerequisite entries, selecting only the prerequisiteId
    const courses = await this.prisma.course.findMany({
        include: {
            prerequisites: {         // Include the relation named 'prerequisites' (CoursePrerequisite[])
                select: {
                    prerequisiteId: true // From each CoursePrerequisite, select only the ID of the prerequisite course
                }
            }
        }
    });

    // Transform the result to match the frontend's expectation:
    // Replace course.prerequisites = [{prerequisiteId: 1}, {prerequisiteId: 2}]
    // With course.prerequisites = [1, 2]
    return courses.map(course => ({
        ...course, // Keep all original course fields
        // Map the array of prerequisite objects to an array of just the IDs
        prerequisites: course.prerequisites.map(p => p.prerequisiteId)
    }));
  }

  async findById(id) {
    // Also update findById to include and format prerequisites
    const course = await this.prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        prerequisites: {
            select: {
                prerequisiteId: true
            }
        }
      }
    });

    if (course) {
        return {
            ...course,
            prerequisites: course.prerequisites.map(p => p.prerequisiteId)
        };
    }
    return null; // Return null if course not found
  }

  async create(courseData) {
    // If courseData includes an array of prerequisite IDs like { prerequisites: [1, 2] }
    // You need to handle the creation of CoursePrerequisite entries separately.
    const { prerequisites, ...restCourseData } = courseData; // Separate prerequisite IDs
    
    const newCourse = await this.prisma.course.create({
      data: restCourseData, // Create course with core data first
    });

    // If prerequisites were provided, create the join table entries
    if (Array.isArray(prerequisites) && prerequisites.length > 0) {
      const prerequisiteLinks = prerequisites.map(prereqId => ({
        courseId: newCourse.id,
        prerequisiteId: Number(prereqId) // Ensure IDs are numbers
      }));
      
      await this.prisma.coursePrerequisite.createMany({
        data: prerequisiteLinks,
        skipDuplicates: true, // Avoid errors if a link already exists (optional)
      });
    }

    // Re-fetch the course with formatted prerequisites to return consistent data
    return this.findById(newCourse.id); 
  }

  async update(id, courseData) {
    const { prerequisites, ...restCourseData } = courseData;
    const courseId = Number(id);

    // Update the core course data
    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: restCourseData,
    });

    // If prerequisites array is provided (even if empty), manage the links
    if (prerequisites !== undefined) { 
        // Delete existing prerequisites for this course
        await this.prisma.coursePrerequisite.deleteMany({
            where: { courseId: courseId }
        });

        // If there are new prerequisites, create them
        if (Array.isArray(prerequisites) && prerequisites.length > 0) {
            const prerequisiteLinks = prerequisites.map(prereqId => ({
                courseId: courseId,
                prerequisiteId: Number(prereqId)
            }));
            
            await this.prisma.coursePrerequisite.createMany({
                data: prerequisiteLinks,
                skipDuplicates: true, 
            });
        }
    }

    // Re-fetch the course with formatted prerequisites
    return this.findById(courseId);
  }

  async delete(id) {
    // Prisma cascade delete should handle related CoursePrerequisites automatically
    // if the relation is set up correctly in schema.prisma (which it seems to be)
    return this.prisma.course.delete({
      where: { id: Number(id) },
    });
  }

  async findByCategory(category) {
     // Update findByCategory similarly to findAll
    const courses = await this.prisma.course.findMany({
      where: { category: category },
      include: {
        prerequisites: {
          select: { prerequisiteId: true }
        }
      }
    });
    return courses.map(course => ({
        ...course,
        prerequisites: course.prerequisites.map(p => p.prerequisiteId)
    }));
  }

  async getTotalCoursesByCategory(category) {
    return this.prisma.course.count({
      where: { category: category },
    });
  }

  async findByShortName(shortName) {
    // Update findByShortName similarly to findById
    const course = await this.prisma.course.findUnique({
      where: { shortName: shortName },
       include: {
        prerequisites: {
            select: {
                prerequisiteId: true
            }
        }
      }
    });
     if (course) {
        return {
            ...course,
            prerequisites: course.prerequisites.map(p => p.prerequisiteId)
        };
    }
    return null;
  }

  async getTotalCourses() {
    return this.prisma.course.count();
  }

  async getLastAddedCourse() {
    return this.prisma.course.findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }

  // async getCourseWithHighestFailureRate() {

  //     const registrations = await this.prisma.registration.findMany({
  //         where: {
  //             grade: { not: null }
  //         },
  //         include: {
  //             section: {
  //                 include: {
  //                     course: true
  //                 }
  //             }
  //         }
  //     });

  //     const courseStats = {};

  //     registrations.forEach(reg => {
  //         const courseId = reg.section.course.id;

  //         if (!courseStats[courseId]) {
  //             courseStats[courseId] = {
  //                 courseId,
  //                 courseName: reg.section.course.name,
  //                 totalStudents: 0,
  //                 failedStudents: 0
  //             };
  //         }

  //         courseStats[courseId].totalStudents++;

  //         // Assume grades below 'D' or 'F' are failing grades
  //         if (reg.grade === 'F' || reg.grade === 'E') {
  //             courseStats[courseId].failedStudents++;
  //         }
  //     });

  //     let highestFailureRate = 0;
  //     let courseWithHighestFailureRate = null;

  //     Object.values(courseStats).forEach(stats => {
  //         if (stats.totalStudents > 0) {
  //             const failureRate = stats.failedStudents / stats.totalStudents;
  //             stats.failureRate = failureRate;

  //             if (failureRate > highestFailureRate) {
  //                 highestFailureRate = failureRate;
  //                 courseWithHighestFailureRate = stats;
  //             }
  //         }
  //     });

  //     if (courseWithHighestFailureRate) {
  //         return this.prisma.course.findUnique({
  //             where: {
  //                 id: courseWithHighestFailureRate.courseId
  //             }
  //         });
  //     }

  //     return null;
  // }
  // yahya: modified getCourseWithHighestFailureRate() to include failure rate
  // old function is still above
  async getCourseWithHighestFailureRate() {
    const registrations = await this.prisma.registration.findMany({
      where: {
        grade: { not: null },
      },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    const courseStats = {};

    registrations.forEach((reg) => {
      const courseId = reg.section.course.id;

      if (!courseStats[courseId]) {
        courseStats[courseId] = {
          courseId,
          course: reg.section.course, // store the whole course object
          totalStudents: 0,
          failedStudents: 0,
        };
      }

      courseStats[courseId].totalStudents++;

      if (reg.grade === "F" || reg.grade === "E") {
        courseStats[courseId].failedStudents++;
      }
    });

    let highestFailureRate = 0;
    let courseWithHighestFailureRate = null;

    Object.values(courseStats).forEach((stats) => {
      if (stats.totalStudents > 0) {
        const failureRate = stats.failedStudents / stats.totalStudents;
        stats.failureRate = failureRate * 100;

        if (failureRate > highestFailureRate) {
          highestFailureRate = failureRate * 100;
          courseWithHighestFailureRate = stats;
        }
      }
    });

    if (courseWithHighestFailureRate) {
      return {
        ...courseWithHighestFailureRate.course,
        failureRate: courseWithHighestFailureRate.failureRate,
      };
    }

    return null;
  }

  async getCourseWithMostPrerequisites() {
    const courses = await this.prisma.course.findMany({
      include: {
        prerequisites: true,
      },
    });

    const courseWithMostPrerequisites = courses.reduce(
      (maxCourse, currentCourse) => {
        return currentCourse.prerequisites.length >
          maxCourse.prerequisites.length
          ? currentCourse
          : maxCourse;
      },
      courses[0]
    );

    return courseWithMostPrerequisites;
  }

  async getMostRegisteredCourse() {
    // Get all courses with their registrations
    const coursesWithRegistrations = await this.prisma.course.findMany({
      include: {
        sections: {
          include: {
            registrations: true,
          },
        },
      },
    });

    // Calculate total registrations per course
    let maxRegistrations = 0;
    let mostRegisteredCourse = null;

    coursesWithRegistrations.forEach((course) => {
      const totalRegistrations = course.sections.reduce((sum, section) => {
        return sum + section.registrations.length;
      }, 0);

      if (totalRegistrations > maxRegistrations) {
        maxRegistrations = totalRegistrations;
        mostRegisteredCourse = course;
      }
    });

    return mostRegisteredCourse;
  }
}

export default CourseRepo;
