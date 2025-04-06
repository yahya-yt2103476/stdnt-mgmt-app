//this is a simple express server to serve the frontend
import express from 'express';
import cors from 'cors'
import usersRepo from './repos/usersRepo.js';
import studentRepo from './repos/studentRepo.js';
import instructorRepo from './repos/instructorRepo.js'
import adminRepo from './repos/adminRepo.js'
import coursesRepo from './repos/coursesRepo.js'
import sectionsRepo from './repos/sectionsRepo.js'
import registrationsRepo from './repos/registrationsRepo.js'




const app = express()
const PORT = 3001;

app.use(cors({

}))
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
    } catch (e) {
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
app.delete("/api/students/:id", async (request, res) => {
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
app.delete("/api/instructors/:id", async (request, res) => {
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


//endpoints for courses

//receive all courses
app.get("/api/courses/", async (request, res) => {
    const users = await coursesRepo.GetCourses()
    res.json(users)
})

//send an id to the endpoint, u receive an object of course
app.get("/api/courses/:id", async (request, res) => {
    const id = request.params.id;
    const user = await coursesRepo.GetCourse(id)
    res.json(user)
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/courses", async (request, res) => {
    const course = request.body;
    try {
        const result = await coursesRepo.UpdateCourse(course);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating course:", error);
    }
});

//send an id to the endpoint, u receive a message whether deleted or not
app.delete("/api/courses/:id", async (request, res) => {
    const course = request.params.id;
    try {
        const result = await coursesRepo.DeleteCourse(course);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating course:", error);
    }
});


//endpoints for sections

//receive all sections
app.get("/api/sections/", async (request, res) => {
    const users = await sectionsRepo.GetSections()
    res.json(users)
})


//send an id to the endpoint, u receive an object of section
app.get("/api/sections/:id", async (request, res) => {
    const id = request.params.id;
    const user = await sectionsRepo.GetSection(id)
    res.json(user)
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/sections", async (request, res) => {
    const section = request.body;
    try {
        const result = await sectionsRepo.UpdateSection(section);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating section:", error);
    }
});

//send an id to the endpoint, u receive a message whether deleted or not
app.delete("/api/sections/:id", async (request, res) => {
    const section = request.params.id;
    try {
        const result = await sectionsRepo.DeleteSection(section);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating section:", error);
    }
});

//send an object to the endpoint, u receive a message whether added or not
app.post("/api/sections", async (request, res) => {
    const section = request.body;
    try {
        const result = await sectionsRepo.AddSection(section);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating section:", error);
    }
});

//send a course id to the endpoint, u receive the sections of that specific course
app.get("/api/sections/course/:id", async (request, res) => {
    const id = request.params.id;
    const user = await sectionsRepo.GetSectionsOfCourse(id)
    res.json(user)
})

//send a specific semester to the endpoint, u receive the sections of that specific semester
app.get("/api/sections/semester/:id", async (request, res) => {
    const id = request.params.id;
    const user = await sectionsRepo.SectionsOfSpecificSem(id)
    res.json(user)
})



//endpoints for registrations

//receive all registrations
app.get("/api/registration/", async (request, res) => {
    const users = await registrationsRepo.GetRegistrations()
    res.json(users)
})

//send an id to the endpoint, u receive an object of registration
app.get("/api/registration/:id", async (request, res) => {
    const id = request.params.id;
    const user = await registrationsRepo.GetRegistration(id)
    res.json(user)
})

//send an object to the endpoint, u receive a message whether modified or not
app.post("/api/registration", async (request, res) => {
    const registration = request.body;
    try {
        const result = await registrationsRepo.UpdateRegistration(registration);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating registration:", error);
    }
});

//send an id to the endpoint, u receive a message whether deleted or not
app.delete("/api/registration/:id", async (request, res) => {
    const registrationId = request.params.id;
    try {
        const result = await registrationsRepo.DeleteRegistration(registrationId);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating registration:", error);
    }
});

//send an object to the endpoint, u receive a message whether added or not
app.post("/api/registration", async (request, res) => {
    const registration = request.body;
    try {
        const result = await registrationsRepo.CreateRegistration(registration);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error updating registration:", error);
    }
});



app.listen(PORT, () => {
    console.log(`Student Managament System server is running on http://localhost:${PORT}\n base url is http://localhost:${PORT}/api/ ✅\n`);
    console.log("Endpoints are:\n");

    console.log("user related endpoints:");
    console.log("GET /api/users");
    console.log("GET /api/users/:id for a specific user\n");

    console.log("student related endpoints:");
    console.log("GET /api/students");
    console.log("GET /api/students/:id for a specific student");
    console.log("POST /api/students to update a student");
    console.log("DELETE /api/students/:id to delete a student\n");

    console.log("instructor related endpoints:");
    console.log("GET /api/instructors");
    console.log("GET /api/instructors/:id for a specific instructor");
    console.log("POST /api/instructors to update an instructor");
    console.log("DELETE /api/instructors/:id to delete an instructor\n");

    console.log("admin related endpoints:");
    console.log("GET /api/admins");
    console.log("GET /api/admins/:id for a specific admin");
    console.log("POST /api/admins to update an admin\n");

    console.log("course related endpoints:");
    console.log("GET /api/courses");
    console.log("GET /api/courses/:id for a specific course");
    console.log("POST /api/courses to update a course");
    console.log("DELETE /api/courses/:id to delete a course\n");

    console.log("section related endpoints:");
    console.log("GET /api/sections");
    console.log("GET /api/sections/:id for a specific section");
    console.log("POST /api/sections to update a section");
    console.log("DELETE /api/sections/:id to delete a section");
    console.log("POST /api/sections to add a section");
    console.log("GET /api/sections/course/:id to get sections of a specific course");
    console.log("GET /api/sections/semester/:id to get sections of a specific semester\n");

    console.log("registration related endpoints:");
    console.log("GET /api/registration");
    console.log("GET /api/registration/:id for a specific registration");
    console.log("POST /api/registration to update a registration");
    console.log("DELETE /api/registration/:id to delete a registration");
    console.log("POST /api/registration to add a registration\n");
    console.log("this is a simple server to handle the reading and writing requests, created by Ayoub(:");

});
