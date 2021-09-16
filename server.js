/**
 * Entry point of application
 */
const { io, server, app } = require("./init");

const PORT = process.env.PORT || 3000;
const { db } = require('./models/index');
const routers = require('./routers');

// All routes
app.use(routers);

// If requested url doesn't match , throw  error with 404 status code
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  // Set default error status 500
  err.status = typeof err.status === "number" ? err.status : 500;

  // Set default message
  if (err.status === 500 || !err.message) {
    err.message = "Internal Server Error!";
  }

  // return response
  return res.status(err.status).json({
    status: false,
    message: err.message,
  });
});

/**
 * Socket connection
 */
io.sockets.on("connection", socket => {
  console.log("New socket connection established", socket.id);
});


// db connection
db.sequelize
  .sync({ logging: false, alter: true })
  .then(() => {
    console.log('\x1b[33m%s\x1b[0m', 'Database connection established successfully');
    // Start server
    server.listen(PORT, () => {
      console.log('\x1b[33m%s\x1b[0m', `Server is listening at: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));