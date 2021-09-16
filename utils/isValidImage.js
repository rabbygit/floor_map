module.exports.isValidImage = (file) => {
    const type = file.type.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};