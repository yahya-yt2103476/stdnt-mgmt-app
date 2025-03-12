const icons = [];
const users = [];

const form = document.querySelector("#form")
const std_icn = document.querySelector("#Student-icon")
icons.push(std_icn)
const Inst_icn = document.querySelector("#Instructor-icon")
icons.push(Inst_icn)
const Admin_icn = document.querySelector("#Admin-icon")
icons.push(Admin_icn)

console.log("will print users in a min");

const path = "http://127.0.0.1:5500/database/users.json"
const response = fetch(path).then(r => r.json()
).then(data => data.forEach(element => {
    console.log(element);

})
)


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


function handleLoginUser(e) {
    e.preventDefault()

    const data = new FormData(e.target)
    console.log(data);
    form.reset();


}