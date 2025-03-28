const CoursesContainer = document.querySelector(".CoursesContainer")
const SectionsContainer = document.querySelector(".sectionsContainer");
async function main() {



    async function fetchCourses() {
        const data = await fetch("http://127.0.0.1:5500/database/courses.json").then(r => r.json()).then(d => {
            return d
        })
        return data;

    }
    const data = await fetchCourses()
    console.log(data);



    data.forEach(course => {
        CoursesContainer.innerHTML += `
        <div class="container">
            <div class="header">${course.id} (${course.name})</div>
            <div class="courseDetails">
                <b>Course Details:</b>
                <p>Title: ${course.name}</p>
                <p>Category: ${course.category}</p>
                <p>Crediet Hours: ${course.creditHours}</p>
            </div>
            <div class="description">
                <p>${course.Description}</p>
            </div>
            <div class="btn-container"><button onclick="loadsections('${course.id}')">View Sections</button></div>

        </div>
        `
    })


}


async function loadsections(courseid) {
    let data = [];
    data = await fetch("http://127.0.0.1:5500/database/sections.json").then(r => r.json()).then(d => {
        return d
    })
    SectionsContainer.innerHTML = ``

    const sections = data.filter(s => s.courseId == courseid)
    const sectionsArray = Array.isArray(sections) ? sections : [sections];
    console.log("testing");
    sectionsArray.forEach(s=>console.log(s)
    )
    if (!sectionsArray) {
        SectionsContainer +=`
        <p>No available Sections for this course...</p>
        `
    } else {
        
    }
    sectionsArray.forEach((sec) => {
        SectionsContainer.innerHTML += `
        <div class="sectioncontainer">
        <p class="section-id">Section ID: ${sec.id}</p>
        <p>Instructor: ${sec.instructorName}</p>
        <p>Semester: ${sec.semester}</p>
        <p>capacity: ${sec.capacity}</p>
        <p>remaining seats: 18</p>
        <p>Time: ${sec.Time}</p>
        <p>Days: ${sec.Days}</p>
        <button id="Register-sections">Register</button>
    </div>
        `
    })


}
main()

