import fs from 'fs-extra';
import path from 'path';


class studentRepo {
    constructor(parameters) {
        this.StudentsFilePath = path.join(process.cwd(), "database/students.json")
        
        
    }



    //get all students
    async GetStudents() {
        const studs = await fs.readJSON(this.StudentsFilePath);
        return studs;

    }

    //Get A specific Student. Pass the student id.
    async GetStudent(StudentID) {
        const StudID = parseInt(StudentID);
        const studs = await this.GetStudents();


        const DesiredStudent = studs.find((student) => student.id == StudID);
        if (DesiredStudent != null) {
            return DesiredStudent;
        } else {
            return "No student with specified Id"
        }
    }

    //Updating a Student Information. Pass the *Student Object*
    async UpdateStudent(studentData) {
        const studs = await this.GetStudents();
        const DesiredStudentIndex = studs.findIndex((student) => student.id == studentData.id);

        if (DesiredStudentIndex != null) {
            studs.splice(DesiredStudentIndex, 1)
            studs.push(studentData)
            await fs.writeJSON(this.StudentsFilePath, studs)
            return "student updated Successfully"
        } else {
            return "No student with specified Id"
        }
    }

    //Delete a Student entirly. Pass the student Id
    async DeleteStudent(studentID) {
        const studs = await this.GetStudents()
        const DesiredStudentIndex = studs.findIndex((student) => student.id == studentID);
        
        if (DesiredStudentIndex != null) {
            studs.splice(DesiredStudentIndex, 1)
            await fs.writeJSON(this.StudentsFilePath, studs)
            return "student deleted Successfully"
        } else {
            return "No student with specified Id"
        }

    }

}



export default new studentRepo()






