const moment = require("moment");
const db = require("../db");
const { isEmpty, empty } = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create An Article
 * @param {object} req
 * @param {object} res
 * @returns {object} object reflection
 */

const createArticle = async (req, res) => {
  const { user_id } = req.user;
  const { article } = req.body;

  const createdAt = moment(new Date());

  if (isEmpty(article)) {
    errorMessage.error = "Field cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  const createArticleQuery = `INSERT INTO articles(
      user_id, article, created_on
  ) 
  VALUES ($1, $2, $3) 
  returning *`;
  const values = [user_id, article, createdAt];
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
 * Get All Articles
 * @param {object} req
 * @param {object} res
 * @returns {object} array of articles
 */

const getAllArticles = async (req, res) => {
  const getAllArticlesQuery = `SELECT * FROM articles ORDER BY id DESC `;

  try {
    const { rows } = await db.query(getAllArticlesQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No articles available";
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

const updateArticles = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { article, is_flagged } = req.body;

  const findArticleQuery = `SELECT * FROM articles WHERE id=$1`;
  const updateArticle = `UPDATE articles SET article=$1, is_flagged=$2 WHERE id=$3 RETURNING *`;
  try {
    const { rows } = await db.query(findArticleQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "Article Cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this article";
      return res.status(status.unauthorized).send(errorMessage);
    }
    const values = [article, is_flagged, id];
    const response = await db.query(updateArticle, values);
    const dbResult = response.rows[0];
    successMessage.data = dbResult;
    return res.status(status.success).send(successMessage);
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

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deleteArticleQuery = `DELETE FROM articles WHERE id=$1 AND user_id = $2 returning *`;
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
  getAllArticles,
  updateArticles,
  deleteArticle,
};
