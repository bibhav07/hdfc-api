require("dotenv").config();
require("express-async-errors");

//==========================================extra security packages

//used to saving http attacks-
const helmet = require("helmet");

//Cross-Origin Resource Sharing, used for allowing accessibility of our service from various domains
const cors = require("cors");

//used for any bad user input - saves cross-site-scripting-attack
const xss = require("xss-clean");

//limiting the amount of hit user can hit
const rateLimit = require("express-rate-limit");


const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const moviesRouter = require("./routes/movies");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());

const corsOpriotns = {
    origin : process.env.ALLOWED_CLIENTS.split(",")
};
app.use(cors(corsOpriotns));
app.use(xss());


app.get("/", (req, res) => {
    res.send("Task api");
})



app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", moviesRouter);
// app.use("/api/v1/movies", authenticateUser, moviesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
