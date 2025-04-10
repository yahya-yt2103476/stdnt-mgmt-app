
import { fetchAllPublishedCourses, createPublishedCourse, deletePublishedCourse, fetchPublishedCourse, updatePublishedCourse } from "./published-courses-service.js";



console.log("all published courses");
const courses= await fetchAllPublishedCourses()


console.log("\n \n specific course");
const specificCourse= await fetchPublishedCourse(1)

console.log("\n \n create course");
const newCourse= {
    id: 5,
    title: "New Course",
    description: "This is a new course",
    instructor: "John Doe",
    duration: "10 hours",
    price: 99.99,
    publishedDate: "2023-10-01",
};
const createCourse= await createPublishedCourse(newCourse)
console.log(createCourse)

console.log("updated list of courses");
const updatedCourses= await fetchAllPublishedCourses()
console.log(updatedCourses)

console.log("\n \n update course");
const updatedCourse= {
    id: 1,
    title: "Updated Course",
    description: "This is an updated course",
    instructor: "Jane Doe",
    duration: "15 hours",
    price: 79.99,
    publishedDate: "2023-10-02",
};
const updateCourse= await updatePublishedCourse(updatedCourse)

console.log("updated list of courses");
const updatedCourses2= await fetchAllPublishedCourses()
console.log(updatedCourses2)

console.log("\n \n delete course");
await deletePublishedCourse(1)
console.log("updated list of courses");
const updatedCourses3= await fetchAllPublishedCourses()
console.log(updatedCourses3)




