async function main() {
    const icons = [];
    let users = []

const form = document.querySelector("#form")
const std_icn = document.querySelector("#Student-icon")
icons.push(std_icn)
const Inst_icn = document.querySelector("#Instructor-icon")
icons.push(Inst_icn)
const Admin_icn = document.querySelector("#Admin-icon")
icons.push(Admin_icn)
const indicator = document.querySelector("#indicator")
const userType = document.querySelector("#usertype")

console.log("will print users in a min");

const path = "http://127.0.0.1:5500/database/users.json"

users = await fetch(path).then((e)=> e.json()).then((data) => {return data});
users.forEach(u=> console.log(u));



let usertype;

std_icn.addEventListener("click", () => handleUserType("Student"))
Inst_icn.addEventListener("click", () => handleUserType("Instructor"))
Admin_icn.addEventListener("click", () => handleUserType("Admin"))
form.addEventListener("submit", handleLoginUser)



function handleUserType(e) {
    icons.forEach((i) => {
        i.style.transform = "scale(1)";
        i.style.color = "grey"
    })
    console.log(e)
    if (e === "Student") {
        usertype = e
        std_icn.style.transform = "scale(1.05)";
        std_icn.style.color = "Black"
        document.body.style.background = "linear-gradient(to right,rgba(107, 17, 203, 0.5),rgba(37, 116, 252, 0.5))"

    } else if (e === "Instructor") {
        usertype = e
        Inst_icn.style.transform = "scale(1.05)";
        Inst_icn.style.color = "Black"
        document.body.style.background = "linear-gradient(to right,rgba(17, 153, 142, 0.5),rgba(56, 239, 126, 0.5))"
    } else if (e === "Admin") {
        usertype = e
        Admin_icn.transform = "scale(1.05)";
        Admin_icn.style.color = "Black"
        document.body.style.background = "linear-gradient(to right,rgba(255, 65, 75, 0.8),rgba(255, 75, 43, 0.5))"
    }
}


async function handleLoginUser(e) {
    e.preventDefault()

    const formData = new FormData(form);
    let formObject = {};

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    var user = users.find(u=>{
        return u.email == formObject.email && u.password == formObject.password
    })    
    if(user && usertype != undefined){
        console.log(`user have been found`);
        indicator.style.display = "none"

        //Mahmoud added the following function
        loadPage(user,"../instructor-view/instructor-mp/instructor-mp.html");
    }
    else if(usertype == undefined){
        userType.style.display = "block"
        await new Promise(resolve => setTimeout(resolve, 4000));
        userType.style.display = "none"
    }else{
        indicator.style.display = "block"
    }    
    form.reset();


}
}

main()



/*
Mahmoud added this function
currently this function isn't complete it's just a trail
*/
async function loadPage(user,page){
    const mainContent = document.querySelector("html");
    const response = await fetch(page);
    const result = await response.text();
    mainContent.innerHTML = result;



    // try {
    //     const response = await fetch(page);
    //     if (!response.ok) {
    //         throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
    //     }
    //     const htmlContent = await response.text(); // Use .text() for HTML files
    //     mainContent.innerHTML = htmlContent; // Insert the HTML content into the DOM
    // } catch (error) {
    //     console.error("Error loading page:", error);
    // }


}