const moment = require("moment");
const db = require("../db");
const { isEmpty, empty } = require("../helpers/validation");
const cloudinary = require("cloudinary").v2;
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create An Article
 * @param {object} req
 * @param {object} res
 * @returns {object} object reflection
 */

const createArticle = async (req, res) => {
  const { user_id } = req.user;
  const { title, article } = req.body;

  const createdAt = moment(new Date());

  if (isEmpty(title)) {
    errorMessage.error = "Title cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (isEmpty(article)) {
    errorMessage.error = "Field cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  const createArticleQuery = `INSERT INTO posts(
      user_id ,title,  article
  ) 
  VALUES ($1, $2, $3) 
  returning *`;
  const values = [user_id, title, article];
  try {
    const { rows } = await db.query(createArticleQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "Article already exists";
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = "Unable to create article";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Create A Gif
 * @param {object} req
 * @param {object} res
 * @returns {object} response object
 */

const createGifPost = async (req, res) => {
  const { user_id } = req.user;
  const { title } = req.body;
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
      const createGifQuery = `INSERT INTO posts(
                user_id,title, gif
            ) VALUES ( $1, $2, $3)
            returning *`;
      const values = [user_id, title, gif_url];
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
        errorMessage.message = "Unable to create gif content";
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
 * Get All Posts
 * @param {object} req
 * @param {object} res
 * @returns {object} array of articles
 */

const getAllPosts = async (req, res) => {
  const getAllArticlesQuery = `SELECT * FROM posts ORDER BY id DESC `;

  try {
    const { rows } = await db.query(getAllArticlesQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.message = "No articles available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.message = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get One Article
 * @param {object} req
 * @param {object} res
 * @returns {object} array containing one gif
 */

const getOnePost = async (req, res) => {
  const { id } = req.params;

  const findOnePostQuery = `SELECT * FROM posts WHERE id=$1`;
  try {
    const { rows } = await db.query(findOnePostQuery, [id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No article available";
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
 * Update An article
 * @param {object} req
 * @param {object} res
 * @returns {object} updated article
 */

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { title, article, is_flagged } = req.body;

  const findPostQuery = `SELECT * FROM posts WHERE id=$1`;

  const updateArticle = `UPDATE posts SET title=$1, article=$2, is_flagged=$3 WHERE id=$4 RETURNING *`;
  // const updateGif = `UPDATE posts SET gif=$1, is_flagged=$2 WHERE id=$3 RETURNING *`;

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const { rows } = await db.query(findPostQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "Post Cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this article";
      return res.status(status.unauthorized).send(errorMessage);
    }

    const articlevalues = [title, article, is_flagged, id];

    if (article) {
      const response = await db.query(updateArticle, articlevalues);
      const dbResult = response.rows[0];
      successMessage.data = dbResult;
      return res.status(status.success).send(successMessage);
    }

    if (article === undefined) {
      await cloudinary.uploader
        .upload(req.file.path)
        .then(async (result) => {
          const gif_url = result.secure_url;
          const updateGifQuery = `UPDATE posts SET title=$1, gif=$2, is_flagged=$3 WHERE id=$4 RETURNING *`;
          const gifvalues = [title, gif_url, is_flagged, id];
          if (isEmpty(gif_url)) {
            errorMessage.error = "Upload a gif image";
            return res.status(status.bad).send(errorMessage);
          }

          try {
            const response = await db.query(updateGifQuery, gifvalues);
            console.log("got here 3", response);
            const dbResponse = response.rows[0];
            successMessage.data = dbResponse;
            return res.status(status.created).send(successMessage);
          } catch (error) {
            errorMessage.message = "Unable to create gif content";
            return res.status(status.error).send(errorMessage);
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: "Failed to upload",
            error,
          });
        });
    }
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Delete An Aricle
 * @param {object} req
 * @param {object} res
 * @returns {void} return response article deleted
 */

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deleteArticleQuery = `DELETE FROM posts WHERE id=$1 AND user_id = $2 returning *`;
  try {
    const values = [id, user_id];
    const { rows } = await db.query(deleteArticleQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "No article found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = "Article Deleted Sucessfully";
    return res.send(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.error).send(error);
  }
};

module.exports = {
  createArticle,
  getAllPosts,
  getOnePost,
  updatePost,
  deletePost,
  createGifPost,
  //   getAllArticles,
  //   updateArticles,
  //   deleteArticle,
  //   getOneArticle,
};
