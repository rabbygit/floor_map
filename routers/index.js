/*
 * This file centralize all routes of the system
 *
 */
const router = require('express').Router();

const { createDevice, getDevices, getDevice, deviceStatus, updateDevice, deleteDevice } = require('../controllers/devices');
const { getPrograms, createProgram, updateProgram, getContent, deleteProgram } = require('../controllers/programs');
const { getContents, createContent, deleteContent } = require('../controllers/contents');

// Device related routes defination
router.get('/api/devices', getDevices);
router.post('/api/devices', createDevice);
router.get('/api/devices/url', getDevice);
router.put('/api/devices/:device_id', updateDevice);
router.delete('/api/devices/:device_id', deleteDevice);
router.put('/api/devices/:device_id/status', deviceStatus);

// Program related routes defination
router.get('/api/programs', getPrograms);
router.post('/api/programs', createProgram);
router.delete('/api/programs/:program_id', deleteProgram);
router.get('/api/programs/:program_id/contents', getContent);
router.put('/api/programs/:program_id', updateProgram);

// Content related routes defination
router.get('/api/contents', getContents);
router.post('/api/contents', createContent);
router.delete('/api/contents/:content_id', deleteContent);


// Export the router module
module.exports = router;
