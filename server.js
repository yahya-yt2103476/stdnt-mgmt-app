//this is a simple express server to serve the frontend
import express from 'express';
import cors from 'cors'
import usersRepo from './repos/usersRepo.js';
import studentRepo from './repos/studentRepo.js';
import instructorRepo from './repos/instructorRepo.js'
import adminRepo from './repos/adminRepo.js'




const app = express()
const PORT = 3001;
app.use(cors())
app.use(express.json())

//entry
app.get("/api/", async (request, res) => {
    res.json("this is a simple server to handle the reading and writing requests")
})

//endpoints for users
app.get("/api/users", async (request, res) => {
    const users = await usersRepo.getUsers()
    res.json(users)
})

app.get("/api/users/:id", async (request, res) => {
    const id = request.params.id;
    const user = await usersRepo.getUser(id)
    res.json(user)
})



//endpoints for students, receive all students
app.get("/api/students/", async (request, res) => {
    const users = await studentRepo.GetStudents()
    res.json(users)
})

//send an id to the endpoint, u receive an object of student
app.get("/api/students/:id", async (request, res) => {
    try {
        const id = request.params.id;
        const user = await studentRepo.GetStudent(id)
        res.json(user)
    }catch(e){
        console.error(`error happened ${e}`)
    }
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/students", async (request, res) => {
    const student = request.body;
    try {
        const result = await studentRepo.UpdateStudent(student);
        res.status(200).json({ message: "Student updated", result });
    } catch (error) {
        console.error("Error updating student:", error);
    }
});

//send an id to the endpoint, u receive a message whether delted or not
app.delete("/api/students:id", async (request, res) => {
    const student = request.params.id;
    try {
        const result = await studentRepo.DeleteStudent(student);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating student:", error);
    }
});




//endpoints for instructors, receive all instructors
app.get("/api/instructors/", async (request, res) => {
    const users = await instructorRepo.GetInstructors()
    res.json(users)
})

//send an id to the endpoint, u receive an object of instructor
app.get("/api/instructors/:id", async (request, res) => {
    const id = request.params.id;
    const user = await instructorRepo.GetInstructor(id)
    res.json(user)
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/instructors", async (request, res) => {
    const instructor = request.body;
    try {
        const result = await instructorRepo.UpdateInstructor(instructor);
        res.status(200).json({ message: "Instructor updated", result });
    } catch (error) {
        console.error("Error updating instructor:", error);
    }
});

//send an id to the endpoint, u receive a message whether deleted or not
app.delete("/api/instructors:id", async (request, res) => {
    const instructor = request.params.id;
    try {
        const result = await instructorRepo.DeleteInstructor(instructor);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating instructor:", error);
    }
});


//endpoints for admins, receive all admins
app.get("/api/admins/", async (request, res) => {
    const users = await adminRepo.getAdmins()
    res.json(users)
})

//send an id to the endpoint, u receive an object of admin
app.get("/api/admins/:id", async (request, res) => {
    const id = request.params.id;
    const user = await adminRepo.getAdmin(id)
    res.json(user)
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/admins", async (request, res) => {
    const admin = request.body;
    try {
        const result = await adminRepo.UpdateAdmin(admin);
        res.status(200).json({ message: "Admin updated", result });
    } catch (error) {
        console.error("Error updating admin:", error);
    }
});





app.listen(PORT, () => {
    console.log(`Student Managament System server is running on http://localhost:${PORT}\n base url is http://localhost:${PORT}/api/ ✅\n`);
    console.log("Endpoints are:\n");
    console.log("GET /api/users");
    console.log("GET /api/users/:id for a specific user\n");

    console.log("GET /api/students");
    console.log("GET /api/students/:id for a specific student");
    console.log("POST /api/students to update a student");
    console.log("DELETE /api/students:id to delete a student\n");

    console.log("GET /api/instructors");
    console.log("GET /api/instructors/:id for a specific instructor");
    console.log("POST /api/instructors to update an instructor");
    console.log("DELETE /api/instructors:id to delete an instructor\n");

    console.log("GET /api/admins");
    console.log("GET /api/admins/:id for a specific admin");
    console.log("POST /api/admins to update an admin");

});
