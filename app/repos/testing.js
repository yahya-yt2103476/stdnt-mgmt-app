import UserRepo from "./user-repo.js"


const userrepo = new UserRepo()
const user =  userrepo.findUserByEmailAndPassword("ahmad@example.com", "pass123");
console.log(user);





