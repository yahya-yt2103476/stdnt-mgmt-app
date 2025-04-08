import fs from 'fs-extra';
import path from 'path';


class instructorRepo{
    constructor(params){
        this.InstructorsFilePath = path.join(process.cwd(), "backend/database/instructors.json");

    }

    //get all instructors
    async GetInstructors(){
        const insts = await fs.readJSON(this.InstructorsFilePath);
        return insts
    }

    //Get a specific instructor. Pass the instructor id
    async GetInstructor(InstructorID){
        const insts = await this.GetInstructors()
        const InstID = parseInt(InstructorID)

        const desiredInstructor = insts.find((I)=>I.id == InstID)
        if (desiredInstructor) {
            return desiredInstructor
        }else{
            return "No Instructor with specified id"
        }
    }
    
    //Update an Instructor Information. Pass the *Instructor Object* 
    async UpdateInstructor(Instructor){
        const insts = await this.GetInstructors();
        const InstID = parseInt(Instructor.id);
        const desiredInstructorIndex = insts.findIndex((I) => I.id == InstID);
        if (desiredInstructorIndex != null) {
            insts.splice(desiredInstructorIndex, 1);
            insts.push(Instructor);
            await fs.writeJSON(this.InstructorsFilePath, insts);
            return "Instructor updated successfully";
        } else {
            return "No Instructor with the specified Id";
        }
    }


    //Delete an Instructor entirly. Pass the Instructor Id
    async DeleteInstructor(InstructorID){
        const insts = await this.GetInstructors();
        const InstID = parseInt(InstructorID);
        const desiredInstructorIndex = insts.findIndex((I) => I.id == InstID);
        if (desiredInstructorIndex != null) {
            insts.splice(desiredInstructorIndex, 1);
            await fs.writeJSON(this.InstructorsFilePath, insts);
            return "Instructor deleted successfully";
        } else {
            return "No Instructor with specific Id";
        }
    }

    
}

export default new instructorRepo()