/**
 *
 * @description Valid pptx type check
 * @param {*} file
 * @returns {Boolean}
 */
module.exports.isValidPPT = (file) => {
    const type = file.name.split(".").pop();
    return !["pptx", "ppt"].includes(type) ? false : true;
};