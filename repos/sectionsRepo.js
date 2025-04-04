import fs from 'fs-extra';
import path from 'path';


class sectionsRepo {
    constructor(parameters) {
        this.SectionsFilePath = path.join(process.cwd(), "database/sections.json")
    }

    //get all sections
    async GetSections() {
        const sections = await fs.readJSON(this.SectionsFilePath);
        return sections;
    }

    //Get A specific Section. Pass the section id.
    async GetSection(sectionID) {
        const secID = parseInt(sectionID);
        const sections = await this.GetSections();

        const DesiredSection = sections.find((section) => section.id == secID);
        if (DesiredSection != null) {
            return DesiredSection;
        } else {
            return "No section with specified Id"
        }
    }

    //Updating a Section Information. Pass the *Section Object*
    async UpdateSection(section) {
        const sections = await this.GetSections();
        const DesiredSectionIndex = sections.findIndex((section) => section.id == section.id);

        if (DesiredSectionIndex != null) {
            sections.splice(DesiredSectionIndex, 1)
            sections.push(section)
            await fs.writeJSON(this.SectionsFilePath, sections)
            return "section updated Successfully"
        } else {
            return "No section with specified Id"
        }
    }

    //Delete a Section entirly. Pass the section Id
    async DeleteSection(sectionID) {
        const sections = await this.GetSections()
        const DesiredSectionIndex = sections.findIndex((section) => section.id == sectionID);

        if (DesiredSectionIndex != null) {
            sections.splice(DesiredSectionIndex, 1)
            await fs.writeJSON(this.SectionsFilePath, sections)
            return "section deleted Successfully"
        } else {
            return "No section with specified Id"
        }

    }
    //Add a new section. Pass the *Section Object*
    async AddSection(section) {
        const sections = await this.GetSections();
        if(sections.findIndex((sec) => sec.id == section.id) != -1){
            return "Section with this ID already exists"
        }else{
            sections.push(section)
            await fs.writeJSON(this.SectionsFilePath, sections)
            return "section added Successfully"
        }
    }

    //Get all sections in a specific course. Pass the course id.
    async GetSectionsOfCourse(courseID) {
        const sections = await this.GetSections();
        const sectionsInCourse = sections.filter((section) => section.courseID == courseID);
        if (sectionsInCourse.length != 0) {
            return sectionsInCourse;
        } else {
            return "No sections in this course"
        }
    }

    //Get all sections in a specific semester. Pass the semester id.
    async SectionsOfSpecificSem(semesterID) {
        const sections = await this.GetSections();
        const sectionsInSemester = sections.filter((section) => section.semesterID == semesterID);
        if (sectionsInSemester) {
            return sectionsInSemester;
        } else {
            return "No sections in this semester"
        }
    }

}

export default new sectionsRepo();