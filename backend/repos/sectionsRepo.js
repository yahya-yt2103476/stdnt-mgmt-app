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
    async UpdateSection(sectionData) {
        const sections = await this.GetSections();
        const DesiredSectionIndex = sections.findIndex((section) => section.id == sectionData.id);
        if (DesiredSectionIndex !== -1) {
            sections.splice(DesiredSectionIndex, 1);
            sections.push(sectionData);
            await fs.writeJSON(this.SectionsFilePath, sections);
            return "section updated Successfully";
        } else {
            return "No section with specified Id";
        }
    }

    //Delete a Section entirly. Pass the section Id
    async DeleteSection(sectionID) {
        const sections = await this.GetSections()
        const DesiredSectionIndex = sections.findIndex((section) => section.id == sectionID);

        if (DesiredSectionIndex !== -1) {
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
        const maxId = sections.reduce((max, sec) => Math.max(max, sec.id || 0), 0);
        section.id = maxId + 1;
        
        sections.push(section);
        await fs.writeJSON(this.SectionsFilePath, sections);
        return section;  // Return the section with its new ID
    }

    //Get all sections in a specific course. Pass the course id.
    async GetSectionsOfCourse(courseID) {
        const courseIdNumber = parseInt(courseID);
        const sections = await this.GetSections();
        const sectionsInCourse = sections.filter((section) => section.courseId == courseIdNumber);
        return sectionsInCourse;
    }

    //Get all sections in a specific semester. Pass the semester id.
    async SectionsOfSpecificSem(semesterID) {
        const sections = await this.GetSections();
        const sectionsInSemester = sections.filter((section) => section.semesterID == semesterID);
        return sectionsInSemester; // Always return an array (empty if no sections found)
    }

}

export default new sectionsRepo();