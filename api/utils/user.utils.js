function currentTimestamp() {
    return new Date().toISOString();
}

const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

function generateUsername(username) {
    return (
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).substring(7)
    );
}

export { currentTimestamp, defaultAvatar, generateUsername };
