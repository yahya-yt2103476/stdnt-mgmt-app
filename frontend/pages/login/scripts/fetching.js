import fs from 'fs';


const path = "/Users/ayoubmohammed/Documents/GitHub/web Repos/stdnt-mgmt-app/database/users.json"

// const users = JSON.parse(fs.readFileSync(path))


// console.log(users);
// users.forEach(element => {
//     console.log(`first one is ${element.id}`);
    
// });
const response = await fetch(path)
console.log(response);
