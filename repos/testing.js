import StudentRepo from "../repos/studentRepo.js";

async function main() {
    const Student =
    {
        "id": 3,
        "name": "fatima Al-Mansoori",
        "completedCourses": [{ "courseId": "CMPS101", "grade": "A" }],
        "registeredCourses": ["CMPS201"],
        "gpa": 2.8,
        "major": "Computer Science"
    }

    const studs = await StudentRepo.DeleteStudent(10);
    console.log(studs);





}
main()