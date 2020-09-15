// Users data
// @user structure: { id, username, room }
const users = [];

// @desc: Add user to user array
// @aim: add user when he joins
function addUser( user ) {
    users.push(user);
    return user;
}

// @desc: Delete user 
function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    return users.splice(index, 1)[0];
}

// @desc: Getting room users
function roomUsers(room) {
    return users.filter( user => user.room === room);
}

module.exports = {
    addUser,
    getUser,
    removeUser,
    roomUsers
}