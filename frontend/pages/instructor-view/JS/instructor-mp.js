//hard set variable
let instructorId = "I001"; // this value should be sent from the login page
//remove this variable later

/*
async () => {
const response =  await fetch(BASE_URL);
const data = await response.json();
localStorage.setItem("recipeList",JSON.stringify(data));
}
*/ 

let sectionsLink = "http://127.0.0.1:5500/database/courses.json";
let coursesLink = "http://127.0.0.1:5500/database/sections.json";

let courseList = localStorage.getItem("course_list");
let sectionList = localStorage.getItem("section_list");

if(!courseList || !sectionList)
    loadList(courseList,sectionList);

async function loadList(sec,cor){
    const response1 =  await fetch(sec);
    const data1 = await response1.json();
    localStorage.setItem("section_list",JSON.stringify(data1));

    const response2 =  await fetch(cor);
    const data2 = await response2.json();
    localStorage.setItem("course_list",JSON.stringify(data2));

}

console.log(JSON.stringify(localStorage.getItem("course_list")));


function main(){
  

}
main();


/*

 <h2>Your Courses</h2>
      <div class="course-card">
        <h3>Web Development</h3>
        <p>Category: Programming</p>
        <p>Enrolled Students: 30</p>
        <a href="#" class="view-course-btn">View Course</a>
      </div>

*/