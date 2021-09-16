/**
 *
 * @description Valid pptx type check
 * @param {*} file
 * @returns {Boolean}
 */
module.exports.isValidPPT = (file) => {
    const type = file.name.split(".").pop();
    return type !== "pptx" || type !== "ppt" ? false : true;
};