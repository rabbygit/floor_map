/**
 * Controllers of contents
 */
const { io } = require("../init");
const { col } = require("sequelize");
const { db } = require("../models");
const fsp = require('fs').promises;
const { isValidImage } = require("../utils/isValidImage");
const { isValidPPT } = require("../utils/isValidPPT");
const { powerpointToImages } = require("../utils/converter");

/**
 * 
 * @description find all contents
 * @returns {Array}
 */
const getContents = async (req, res, next) => {
  try {
    const contents = await db.contents.findAll({
      attributes: {
        include: [
          [col("program.program_name"), "program_name"],
        ],
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.programs,
          attributes: [],
        },
        {
          model: db.contents_urls,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      raw: false
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
 * @description create content for a program
 * @returns {Object}
 */
const createContent = async (req, res, next) => {
  try {
    let { program_id, content_type, url, text, delay_time = 0 } = req.fields;
    let { files, pptx } = req.files;
    let bulk_url = [];

    if (!["image", "video", "pptx"].includes(content_type)) {
      return res.status(400).json({
        status: false,
        message: "Invalid content.",
      });
    }

    delay_time = delay_time * 1000; // convert seconds to miliseconds for carousel
    // create the basic content
    const new_content = await db.contents.create({
      content_type,
      text,
      program_id,
    });

    if (content_type === "video") {
      // insert the video url
      await db.contents_urls.create({
        content_type,
        url,
        delay_time,
        content_id: new_content.content_id,
      });
    } else if (content_type === "image") {
      // Handle multiple files
      if (Array.isArray(files)) {
        // Check the image files
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          if (!isValidImage(file)) {
            return res.status(400).json({
              status: false,
              message: "Only jpg/jpeg/png image are allowed",
            });
          }
        }

        // upload images and save in db
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          let new_url = "public/" + Date.now() + "." + file.name.split(".").pop();
          const buffer = await fsp.readFile(file.path);
          await fsp.writeFile(new_url, buffer); // upload image to public folder
          bulk_url.push({
            content_type,
            url: new_url,
            delay_time,
            content_id: new_content.content_id,
          });
        }
        db.contents_urls.bulkCreate(bulk_url); // save urls in db
      } else {
        // Handle single file
        if (!isValidImage(files)) {
          return res.status(400).json({
            status: false,
            message: "Only jpg/jpeg/png image are allowed",
          });
        }

        let new_url = "public/" + Date.now() + "." + files.name.split(".").pop();
        const buffer = await fsp.readFile(files.path);

        await fsp.writeFile(new_url, buffer); // upload image to public folder

        db.contents_urls.create({
          content_type,
          url: new_url,
          delay_time,
          content_id: new_content.content_id,
        });
      }
    } else {
      // check valid pptx
      if (!isValidPPT(pptx)) {
        return res.status(400).json({
          status: false,
          message: "Only pptx file is allowed",
        });
      }

      // Convert the pptx to images
      const imageAray = await powerpointToImages(pptx.path, 'public/');
      // construct bulk url array
      for (let index = 0; index < imageAray.length; index++) {
        bulk_url.push({
          content_type: "image",
          url: imageAray[index],
          delay_time,
          content_id: new_content.content_id,
        });
      }
      db.contents_urls.bulkCreate(bulk_url); // save urls in db
    }

    // Emit event to reload the page
    io.emit("content_change", { program_id });

    return res.status(201).json({
      status: true,
      message: 'New content created!',
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

/**
 *
 * @description delete content 
 * @returns {Object}
 */
const deleteContent = async (req, res, next) => {
  try {
    let { content_id } = req.params;

    // Delete the content
    db.contents.destroy({
      where: {
        content_id,
      }
    });

    return res.status(201).json({
      status: true,
      message: 'New content created!',
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

module.exports = {
  getContents,
  createContent,
  deleteContent,
};