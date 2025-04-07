import fs from 'fs-extra';
import path from 'path';

class usersRepo{
    constructor(parameters){
        this.UsersFilePath = path.join(process.cwd(),"database/users.json")
    }

    //get all the users
    async getUsers(){
        const users = await fs.readJSON(this.UsersFilePath);
        return users;
    }

    // Get a specific User. Pass the User id
    async getUser(UserID) {
        const userID = parseInt(UserID);
        const users = await fs.readJSON(this.UsersFilePath);
        const DesiredUser = users.find((User) => User.id == userID);
        if (DesiredUser != null) {
            return DesiredUser;
        } else {
            return "No user with specified Id"
        }
    }

}

export default new usersRepo();