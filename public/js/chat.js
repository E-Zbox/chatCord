const socket = io();
// html elements
const chatMessages = document.querySelector("div.chat-messages");
const chatForm = document.getElementById("chat-form");
const roomNameH2 = document.getElementById("room-name");
const chatSidebar = document.querySelector("div.chat-sidebar");

const usersArray = [];

const { username, room } = JSON.parse(localStorage.getItem("user details"));
localStorage.removeItem("user details");

roomNameH2.innerText = `${room}`;

// submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    // emit message to server
    socket.emit("chatMessage", msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// message from server
const displayUsers = (users) => {
    let usersUL = chatSidebar.lastElementChild;

    let newUsersUL = document.createElement("ul");
    newUsersUL.id = "users";

    console.log(users);

    users.forEach(({ username }) => {
        let li = document.createElement("li");
        li.innerText = username;
        newUsersUL.appendChild(li);
        console.log(newUsersUL);
    });

    chatSidebar.replaceChild(newUsersUL, usersUL);
    console.log(chatSidebar);
};
socket.on("welcome", (message) => {
    outputMessage(message);

    let { users } = message;

    displayUsers(users);
});

socket.on("message", (message) => {
    let { users } = message;
    outputMessage(message);

    console.log("users : ", users);

    displayUsers(users);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("goodbye", (message) => {
    console.log("goodbye");
    outputMessage(message);

    let { users } = message;

    displayUsers(users);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message join-chatroom
socket.emit("joinRoom", { username, room });

function outputMessage(message) {
    // destructing ...
    const { username, text, time, users } = message;

    // dom elements
    let divMessage = document.createElement("div");
    divMessage.classList.add("message");
    let pMeta = document.createElement("p");
    pMeta.classList.add("meta");
    pMeta.innerText = `${username}`;
    let span = document.createElement("span");
    span.innerText = `${time}`;
    let pText = document.createElement("p");
    pText.classList.add("text");
    pText.innerText = text;

    pMeta.appendChild(span);
    divMessage.appendChild(pMeta);
    divMessage.appendChild(pText);
    chatMessages.appendChild(divMessage);
}
