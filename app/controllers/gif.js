const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const db = require("../db");
const { isEmpty } = require("../helpers/validation");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const { successMessage, errorMessage, status } = require("../helpers/status");

app.use(fileUpload());

/**
 * Create A Gif
 * @param {object} req
 * @param {object} res
 * @returns {object} response object
 */

const createGif = async (req, res) => {
  const { user_id } = req.user;
  const createdAt = moment(new Date());

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  // res.send(req.file);

  await cloudinary.uploader
    .upload(req.file.path)
    .then(async (result) => {
      const gif_url = result.secure_url;
      const createGifQuery = `INSERT INTO gifs(
              user_id, gif, created_on
          ) VALUES ( $1, $2, $3)
          returning *`;
      const values = [user_id, gif_url, createdAt];
      if (isEmpty(gif_url)) {
        errorMessage.error = "Upload a gif image";
        return res.status(status.bad).send(errorMessage);
      }
      try {
        const { rows } = await db.query(createGifQuery, values);
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.created).send(successMessage);
      } catch (error) {
        errorMessage.error = "Unable to create gif content";
        return res.status(status.error).send(errorMessage);
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "Failed to upload",
        error,
      });
    });
};

/**
 * Get All Gifs
 * @param {object} req
 * @param {object} res
 * @returns {object} array of gifs
 */

const getAllGifs = async (req, res) => {
  const getAllGifsQuery = `SELECT * FROM gifs ORDER BY id DESC `;

  try {
    const { rows } = await db.query(getAllGifsQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No gifs available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get One Gif
 * @param {object} req
 * @param {object} res
 * @returns {object} array of gifs
 */

const getOneGif = async (req, res) => {
  const { id } = req.params;

  const findOneGifQuery = `SELECT * FROM gifs WHERE id=$1`;
  try {
    const { rows } = await db.query(findOneGifQuery, [id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No gif available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Update A Gif
 * @param {object} req
 * @param {object} res
 * @returns {object} updated gif
 */

const updateGif = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { gif, is_flagged } = req.body;

  const findGifQuery = `SELECT * FROM gifs WHERE id=$1`;
  const updateGif = `UPDATE gifs SET gif=$1, is_flagged=$2 WHERE id=$3 RETURNING *`;
  try {
    const { rows } = await db.query(findGifQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "Gif Cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this gif";
      return res.status(status.unauthorized).send(errorMessage);
    }
    const values = [gif, is_flagged, id];
    const response = await db.query(updateGif, values);
    const dbResult = response.rows[0];
    successMessage.data = dbResult;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Delete A Gif
 * @param {object} req
 * @param {object} res
 * @returns {void} return response gif deleted
 */

const deleteGif = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deleteGifQuery = `DELETE FROM gifs WHERE id=$1 AND user_id = $2 returning *`;
  try {
    const values = [id, user_id];
    const { rows } = await db.query(deleteGifQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "No gif found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = "Gif Deleted Sucessfully";
    return res.send(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.error).send(error);
  }
};

module.exports = { createGif, getAllGifs, getOneGif, updateGif, deleteGif };
