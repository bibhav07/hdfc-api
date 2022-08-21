const express = require('express')

const router = express.Router()
const {
  getAllMovies,
  createMovie,
  bookMovie
} = require('../controllers/movies');

const authenticateUser = require("../middleware/authentication");

//get all movies accordingly
router.get("/", getAllMovies);

//post movies
router.post("/", authenticateUser ,createMovie);


//movie book route
router.post("/book",  authenticateUser, bookMovie);




module.exports = router
