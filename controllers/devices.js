/**
 * Controllers of devices
 */

// Dependencies
const { Op, QueryTypes } = require("sequelize");
const { db } = require("../models/index");

/**
 *
 * @description get all devices
 * @returns {Object}
 */
const getDevices = async (req, res, next) => {
  try {
    const devices = await db.devices.findAll({
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json({
      status: true,
      devices
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @description Get a single device and its related programs
 * @returns {Object}
 */
const getDevice = async (req, res, next) => {
  try {
    let { url = "" } = req.query;
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    if (!url) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
      });
    }

    // Find the device by the url
    let device = await db.devices.findOne({
      where: {
        url,
        status: true,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "description"],
      },
      include: [{
        model: db.programs,
        where: {
          publish_date: {
            [Op.gte]: TODAY_START,
            [Op.lte]: NOW
          },
        },
        attributes: {
          include: [
            ["createdAt", "devices_programs"],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      }],
      nest: true,
      raw: true,
    });

    if (!device) {
      return res.status(404).json({
        status: false,
        message: "Device doesn't exist.",
      });
    }

    // find the last finished program in case of missing program
    if (!device.programs.program_id) {
      const query = `SELECT * 
                     FROM devices_programs dp
                     JOIN programs p ON dp.program_id = p.program_id
                     WHERE p.publish_date < :now AND dp.device_id = :device_id
                     ORDER BY p.publish_date  DESC
                     LIMIT 1`;
      let programs = await db.sequelize.query(query, {
        replacements: {
          now: NOW,
          device_id: device.device_id,
        },
        type: QueryTypes.SELECT
      });

      if (programs.length) {
        device.programs = programs[0];
      }
    }

    return res.status(200).json({
      status: true,
      device,
    });
  } catch (error) {
    next(error)
  }
};

/**
 *
 * @description create a device
 * @returns {Object}
 */
const createDevice = async (req, res, next) => {
  try {
    let data = req.fields;

    // Find if device exists with this url already!
    const exists = await db.devices.findOne({
      where: {
        url: data.url,
      },
      attributes: ["device_id"],
    });

    if (exists) {
      return res.status(400).json({
        staus: false,
        message: "Device already exists with this url!"
      });
    }

    // create the new device
    let new_device = await db.devices.create(data);

    return res.status(201).json({
      status: true,
      message: 'New device created!',
      new_device,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @description update a device
 * @returns {Object}
 */
const updateDevice = async (req, res, next) => {
  try {
    let { device_id } = req.params;
    let { url } = req.fields;

    // Check if device exits
    const exists = await db.devices.findOne({
      where: {
        device_id,
      },
      attributes: ["device_id"],
    });

    if (!exists) {
      return res.status(404).json({
        staus: false,
        message: "Device doesn't exist."
      });
    }

    // Find if device exists with this url already!
    const url_exists = await db.devices.findOne({
      where: {
        url,
        device_id: {
          [Op.not]: device_id,
        }
      },
      attributes: ["device_id"],
    });

    if (url_exists) {
      return res.status(400).json({
        staus: false,
        message: "Device already exists with this url!"
      });
    }

    // update the device
    await db.devices.update(req.fields, {
      where: {
        device_id,
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Device updated!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @description update status of a device
 * @returns {Object}
 */
const deviceStatus = async (req, res, next) => {
  try {
    let { device_id } = req.params;
    let { status } = req.fields;

    // Check if device exits
    const exists = await db.devices.findOne({
      where: {
        device_id,
      },
      attributes: ["device_id"],
    });

    if (!exists) {
      return res.status(404).json({
        staus: false,
        message: "Device doesn't exist."
      });
    }

    // update the status
    await db.devices.update({ status }, {
      where: {
        device_id,
      },
    });

    let message = 'Device activated!';
    if (!status) {
      message = 'Device deactivated!';
    }

    return res.status(200).json({
      status: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete device and related information
 * @returns {Object}
 */
const deleteDevice = async (req, res, next) => {
  try {
    const { device_id } = req.params;

    if (!device_id) {
      return res.status(400).json({
        staus: false,
        message: "Device required"
      });
    }

    // Find and delete the device
    db.devices.destroy({
      where: {
        device_id,
      },
    });

    db.devices_programs.destroy({
      where: {
        device_id,
      },
    });

    return res.status(200).json({
      staus: true,
      message: "Device deleted"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deviceStatus,
  deleteDevice,
};