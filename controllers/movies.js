const Movies = require("../models/movies");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const getAllMovies = async (req, res) => {
  const { city, movie, cinema } = req.query;
  const queryObject = {};

  if (city) {
    queryObject.city = city;
  }
  if (movie) {
    queryObject.movie = movie;
  }
  if (cinema) {
    queryObject.cinema = cinema;
  }

  const movies = await Movies.find(queryObject).select("-updatedAt -__v -_id");
  return res
    .status(StatusCodes.OK)
    .json({ totalMovies: movies.length, movies });
};

const createMovie = async (req, res) => {
  const movies = await Movies.create(req.body);
  return res.status(StatusCodes.OK).json({ movies });
};


// Here we will simply send the required data ie/ name(movie name), price, city, cinema.
//We are not saving anything here in database because the only goal of this api endpoint is to only verified user can book the tickets or can access this endpoint.
const bookMovie = (req, res, next) => {

  const bookMovieSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price : Joi.number().required(),
    city: Joi.string().required(),
    cinema: Joi.string().required()
  });

  const { error } = bookMovieSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(error);
  };

  return res.status(StatusCodes.CREATED).json({ bookingStatus : "successful", msg : `Ticket of movie ${req.body.name} booked in ${req.body.cinema}, ${req.body.city} at price ${req.body.price}`});

}



module.exports = {
  getAllMovies,
  createMovie,
  bookMovie
};
