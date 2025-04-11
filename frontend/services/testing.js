import { updateRegistrationData } from "./registration-service.js"
const registration= {
    "id": 2,
    "studentId": 2172,
    "sectionId": 5,
    "grade": "A" ,
    "status": "pending"
  }
await updateRegistrationData(registration)
console.log("Registration updated successfully")