-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PublishedCourse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "publishedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionDeadline" DATETIME,
    "interestedInstructorIds" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "PublishedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PublishedCourse" ("courseId", "id", "publishedDate", "semester", "submissionDeadline") SELECT "courseId", "id", "publishedDate", "semester", "submissionDeadline" FROM "PublishedCourse";
DROP TABLE "PublishedCourse";
ALTER TABLE "new_PublishedCourse" RENAME TO "PublishedCourse";
CREATE UNIQUE INDEX "PublishedCourse_courseId_semester_key" ON "PublishedCourse"("courseId", "semester");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
