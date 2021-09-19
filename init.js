// Dependencies
const express = require("express");
const http = require("http");
const cors = require('cors');
const morgan = require('morgan');
const formidableMiddleware = require('express-formidable');
const { Server } = require("socket.io");

// Express app
const app = express();

// Create http server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(formidableMiddleware({
  multiples: true,
}));
app.use("/api/public", express.static('public'));

// Socket initialization
const io = new Server(server, {
  // options
  cors: {
    // origin: "http://localhost:8080",
    origin: '*',
    methods: ["GET", "POST"],
  }
});

module.exports = {
  server,
  io,
  app,
};