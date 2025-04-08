import fs from 'fs-extra';
import path from 'path';

class registrationsRepo {
    constructor(parameters) {
        this.RegistrationFilePath = path.join(process.cwd(), "backend/database/registrations.json")
    }

    //get all registrations
    async GetRegistrations() {
        const regs = await fs.readJSON(this.RegistrationFilePath);
        return regs;
    }

    //Get A specific Registration. Pass the registration id.
    async GetRegistration(RegistrationID) {
        const RegID = parseInt(RegistrationID);
        const regs = await this.GetRegistrations();

        const DesiredRegistration = regs.find((Registration) => Registration.id == RegID);
        if (DesiredRegistration != null) {
            return DesiredRegistration;
        } else {
            return "No registration with specified Id"
        }
    }

    //Updating a Registration Information. Pass the *Registration Object*
    async UpdateRegistration(Registration) {
        const regs = await this.GetRegistrations();
        const DesiredRegistrationIndex = regs.findIndex((Registration) => Registration.id == Registration.id);

        if (DesiredRegistrationIndex != null) {
            regs.splice(DesiredRegistrationIndex, 1)
            regs.push(Registration)
            await fs.writeJSON(this.RegistrationFilePath, regs)
            return "registration updated Successfully"
        } else {
            return "No registration with specified Id"
        }
    }

    //Delete a Registration entirly. Pass the registration Id
    async DeleteRegistration(registrationID) {
        const regs = await this.GetRegistrations()
        const DesiredRegistrationIndex = regs.findIndex((Registration) => Registration.id == registrationID);

        if (DesiredRegistrationIndex != null) {
            regs.splice(DesiredRegistrationIndex, 1)
            await fs.writeJSON(this.RegistrationFilePath, regs)
            return "registration deleted Successfully"
        } else {
            return "No registration with specified Id"
        }

    }

    //Create a Registration
    async CreateRegistration(Registration) {
        const regs = await this.GetRegistrations();
        //this assumes that u don't specifiy the id of the registration manually
        //it will be auto incremented
        //even if you specify it it will be ignored (: as im overwriting it
        const newRegistration = {
            id: regs.length + 1,
            ...Registration
        }
        regs.push(newRegistration);
        await fs.writeJSON(this.RegistrationFilePath, regs)
        return "registration created Successfully"
    }

}

export default new registrationsRepo();