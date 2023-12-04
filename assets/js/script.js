const myForm = document.getElementById("myForm");
const user = document.getElementById("name");
const email = document.getElementById("email");
const result = document.querySelector("#result");

let users = [];
let editable = false;
let userId = "";

//read users data
const URL = "http://localhost:3000";

// Generate Random Id
const getRandomId = () => {
    let randomId = Math.floor(Math.random() * 1000);
    return randomId;
};
// Submit form
myForm.addEventListener("submit" , function (e) {
    e.preventDefault();

    if (editable === false) {
        //create new user
        let id = getRandomId();
        const data = {
        id,
        name: user.value,
        email: email.value,
    }; 
    createUser(data);
    } else {
        //update existing user
        const data = {
            name:user.value,
            email:email.value,
        };
        updateUser(data, userId);
    }
});

//Create User Data
function createUser(user) {
    let extItem = users.find((item) => item.email === user.email);
    console.log('user = ' , user);
    console.log('ext user = ' , extItem);

    if (extItem) {
        alert ("User is already registered, Email exists");
    } else {
        fetch(`${URL}/users` , {
          method: "POST",
          headers: { "Content-Type" : "application/json"},
          body: JSON.stringify(user),
         })
         .then((out) => out.json())
         .then((res) => {
            
            alert ('user created successfully');
            window.location.reload();
         })
         .catch((error) => console.log(error.message));
    }
};

//Get All Users
const getUsers = async () => {
    await fetch(`${URL}/users`,{
        method: "GET" ,
    })
    .then((out) => out.json())
    .then((res) => {//console.log(res)
        printInTable(res);
    })
    .catch();
};
//getUsers();
//self Invoke Function

(function () {
    getUsers();
})();

//Printing in Table
function printInTable(users) {
    // console.log("Printing" , users);

    users.forEach(item => {
        let tr = document.createElement("tr");
        let id = document.createElement("td");
        let name = document.createElement("td");
        let email = document.createElement("td");
        let action = document.createElement("td");

        id.textContent = item.id;
        name.textContent = item.name;
        email.textContent = item.email;
        action.innerHTML = `<button onclick='edit(this)' class='edit'>Edit</button>
        <button onclick='deleteUser(${item.id})' class='delete'>Delete</button>`;
        
        tr.appendChild(id);
        tr.appendChild(name);
        tr.appendChild(email);
        tr.appendChild(action);
        
        result.appendChild(tr);
    });
}

//edit user
function edit(e) {
    // console.log("Edit", e);
    // console.log("Edit", typeof e);

    editable = true;

    let selUser = e.parentElement.parentElement; //current table row selected
    // console.log("selUser", selUser);
    // console.log("selUser", selUser.children[0].innerHTML);

    userId = selUser.children[0].innerHTML; // value taking from first element of tr
    user.value = selUser.children[1].innerHTML;
    email.value = selUser.children[2].innerHTML;
}

//update user
const updateUser = async (data, id) => {
    await fetch(`${URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    .then((out) => out.json())
    .then((res) =>{
        printInTable(users);
        alert("User updated successfully");
        window.location.reload();
    })
    .catch((error)=> console.log(error.message));
};

//delete user
function deleteUser(id) {
    let index = users.findIndex((item)=> item.id === id);
    console.log("index = ", index);

    // Note :
    //1) findIndex() returns the index(position) of the first array element that satisfied the provided test function or  else returns -1
    // 2) this method returs -1 if no match is found
    // 3) findIndex() does not execute the function for empty array Elements

    if (window.confirm(`Are you sure to delete user id = ${id}?`)) {
        fetch(`${URL}/users/${id}`,{
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        })
        .then((out) => out.json())
        .then((res) =>{
            printInTable(users);
            alert("user deleted successfully");
            window.location.reload();
        })
        .catch((error) => console.log(error.message));
    } else {
        return;
    }
}