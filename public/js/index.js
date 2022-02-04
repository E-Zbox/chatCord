const joinForm = document.querySelector("main.join-main form");

joinForm.addEventListener("submit", (e) => {
    let { username, room } = e.target.elements;
    let data = {
        username: username.value,
        room: room.value,
    };
    localStorage.setItem("user details", JSON.stringify(data));
});
