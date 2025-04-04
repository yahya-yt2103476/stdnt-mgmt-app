import fs from 'fs-extra';
import path from 'path';

class adminRepo{
    constructor(params){
        this.AdminsFilePath = path.join(process.cwd(), "database/admins.json")
    }

    //get all admins
    async getAdmins(){
        const admins = await fs.readJSON(this.AdminsFilePath)
        return admins
    }

    //Get a specific Admin. Pass the Admin Id
    async getAdmin(AdminID){
        const adminId= parseInt(AdminID)
        const admins = this.getAdmins()
        const desiredAdmin = admins.find((a)=>a.id==adminId)
        if (desiredAdmin) {
            return desiredAdmin
        }else{
            return "No Admin with Specific Id"
        }
    }

    //ypdating an admin info. Pass the Admin Object
    async UpdateAdmin(Admin){
        const adminId = parseInt(Admin.id)
        const admins = this.getAdmins()
        const desiredAdminIndex = admins.findIndex((a)=>a.id==adminId)
        if (desiredAdminIndex) {
            admins.splice(desiredAdminIndex,1)
            admins.push(Admin)
            fs.writeJSON(admins)
            return "Admin updated successfully"
        }else{
            return "No admin with specified Id"
        }
    }
}

export default new adminRepo();