/**
 * Controllers of programs
 */
// Dependencies
const { unlink } = require('fs/promises');
const { col } = require("sequelize");
const { db } = require("../models/index");

/**
 * 
 * @description get all programs
 * @returns {Array}
 */
const getPrograms = async (req, res, next) => {
  try {
    // Get all latest programs
    const programs = await db.programs.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [{
        model: db.devices,
        attributes: ["device_id", "url"],
        //   required: true,
      }],
      order: [["createdAt", "DESC"]],
      raw: false,
    });

    return res.status(200).json({
      status: true,
      programs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @description get contents for a specific program
 * @returns {Array}
 */
const getContent = async (req, res, next) => {
  try {
    let { program_id = "" } = req.params;

    if (!program_id) {
      return res.status(400).json({
        status: false,
        message: "Bad request."
      });
    }

    // find all contents related to this program
    const contents = await db.contents.findAll({
      where: {
        program_id,
      },
      include: [{
        model: db.contents_urls,
        attributes: [],
      }],
      attributes: {
        include: [
          [col("contents_urls.content_type"), "content_type"],
          [col("contents_urls.url"), "url"],
          [col("contents_urls.delay_time"), "delay_time"],
          [col("contents_urls.content_id"), "content_id"]
        ],
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    return res.status(200).json({
      status: true,
      contents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @description create program
 * @returns {Array}
 */
const createProgram = async (req, res, next) => {
  try {
    let { program_name, publish_date, layout, selected_devices, marquee = "", notice = "" } = req.fields;

    // Create the program
    const new_program = await db.programs.create({
      program_name,
      publish_date,
      layout,
      marquee,
      notice,
    });

    // Create the array to insert into junction table
    const program_devices = [];
    selected_devices.forEach(device => {
      program_devices.push({
        device_id: device,
        program_id: new_program.program_id,
      });
    });

    db.devices_programs.bulkCreate(program_devices);

    return res.status(201).json({
      status: true,
      message: 'New program created!',
      new_program,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @description update program publish date
 * @returns {Array}
 */
const updateProgram = async (req, res, next) => {
  try {
    let { program_id } = req.params;
    let { publish_date } = req.fields;
    console.log(program_id, publish_date);

    // Update the program
    await db.programs.update({ publish_date }, {
      where: {
        program_id,
      },
    });

    return res.status(200).json({
      status: true,
      message: 'program updated!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @description delete program
 * @returns {Object}
 */
const deleteProgram = async (req, res, next) => {
  try {
    let { program_id } = req.params;

    // Find the related images 
    let images = await db.contents_urls.findAll({
      where: {
        content_type: "image",
      },
      include: [{
        model: db.contents,
        where: {
          program_id,
        },
        required: true,
        attributes: [],
      }],
      attributes: ["url"],
      raw: true,
    });

    //  Delete images from local storage
    if (images.length) {
      for (let index = 0; index < images.length; index++) {
        try {
          const { url } = images[index];
          await unlink(url);
        } catch (error) {
          console.error("Error in deleting images", url);
        }
      }
    }

    // Delete the program and related contents
    db.programs.destroy({
      where: {
        program_id,
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Program deleted!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrograms,
  getContent,
  createProgram,
  updateProgram,
  deleteProgram,
};