
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  userType: 'userType'
};

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  name: 'name',
  userId: 'userId'
};

exports.Prisma.InstructorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  userId: 'userId'
};

exports.Prisma.StudentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  major: 'major',
  gpa: 'gpa',
  userId: 'userId'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  shortName: 'shortName',
  name: 'name',
  description: 'description',
  creditHours: 'creditHours',
  category: 'category'
};

exports.Prisma.CoursePrerequisiteScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  prerequisiteId: 'prerequisiteId'
};

exports.Prisma.SectionScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  instructorId: 'instructorId',
  capacity: 'capacity',
  status: 'status',
  semester: 'semester',
  time: 'time',
  location: 'location',
  courseContent: 'courseContent'
};

exports.Prisma.SectionDayScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  day: 'day'
};

exports.Prisma.RegistrationScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  sectionId: 'sectionId',
  grade: 'grade',
  status: 'status'
};

exports.Prisma.CompletedCourseScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  courseId: 'courseId',
  grade: 'grade'
};

exports.Prisma.PublishedCourseScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  semester: 'semester',
  publishedDate: 'publishedDate',
  submissionDeadline: 'submissionDeadline'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserType = exports.$Enums.UserType = {
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT'
};

exports.CourseCategory = exports.$Enums.CourseCategory = {
  MATH: 'MATH',
  SCIENCE: 'SCIENCE',
  COMPUTER_SCIENCE: 'COMPUTER_SCIENCE',
  ENGINEERING: 'ENGINEERING',
  BUSINESS: 'BUSINESS',
  ARTS: 'ARTS',
  HUMANITIES: 'HUMANITIES',
  SOCIAL_SCIENCES: 'SOCIAL_SCIENCES',
  HEALTH: 'HEALTH',
  OTHER: 'OTHER'
};

exports.Status = exports.$Enums.Status = {
  OPEN: 'OPEN',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED'
};

exports.Semester = exports.$Enums.Semester = {
  FALL2023: 'FALL2023',
  SPRING2024: 'SPRING2024',
  SUMMER2024: 'SUMMER2024',
  FALL2024: 'FALL2024',
  SPRING2025: 'SPRING2025',
  SUMMER2025: 'SUMMER2025',
  FALL2025: 'FALL2025',
  SPRING2026: 'SPRING2026',
  SUMMER2026: 'SUMMER2026'
};

exports.Prisma.ModelName = {
  User: 'User',
  Admin: 'Admin',
  Instructor: 'Instructor',
  Student: 'Student',
  Course: 'Course',
  CoursePrerequisite: 'CoursePrerequisite',
  Section: 'Section',
  SectionDay: 'SectionDay',
  Registration: 'Registration',
  CompletedCourse: 'CompletedCourse',
  PublishedCourse: 'PublishedCourse'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
