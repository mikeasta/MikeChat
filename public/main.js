// Implementing SOCKET.IO
const socket = io();

// Getting URL props
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Getting DOM
const roomMessages = document.getElementById("room_messages");
const messageForm = document.getElementById("messaging");

// Joining room
socket.emit("joinRoom", {username, room});

// Joining room (DOM name)
const roomName = document.getElementById("room_name");
roomName.innerText = room;

// Catching "message" event
socket.on("message", ({ username, text, time }) => {
    roomMessages.appendChild(outputMessage({username, text, time}));
})

// Catching roomUsers event 
let usersArray = [];
socket.on("roomUsers", (users) => {
    usersArray = users;
    usersNode(usersArray);
})

// Leaving room
socket.on("leaveRoom", userName => {
    const index = usersArray.findIndex(user => user.username === userName);
    usersArray.splice(index, 1);
    usersNode(usersArray);
    
})

// recreate user array node 
function usersNode(users) {
    const roomUsersNode = document.getElementById("room_users");
    let innerRoomHtml = ``;
    users.forEach( user => {
        innerRoomHtml += `<li>${user.username}</li>`
    });
    roomUsersNode.innerHTML = innerRoomHtml;
}

// Form message event
messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("message_input");
    socket.emit("chatMessage", {
        username,
        text: input.value,
        room
    });
    input.value = "";
})

// Generates message node (li)
function outputMessage( msg ) {
    const { username, text, time } = msg;
    let li = document.createElement("li");
    li.className = "message";
    li.innerHTML = `<span class="chat_username">
    ${username}
</span>
<span class="chat_text"> ${text} </span>
<span class="chat_date">
    ${time}
</span>`
    return li;
}