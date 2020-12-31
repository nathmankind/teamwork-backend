// CRUD for articles

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

// /**
//  * Update An article
//  * @param {object} req
//  * @param {object} res
//  * @returns {object} updated article
//  */

// const { id } = req.params;

// const { user_id } = req.user;
// const updateArticles = async (req, res) => {
//   const updateArticleQuery;
// };

module.exports = { createArticle, getAllArticles };
