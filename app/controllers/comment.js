//CRUD for article comment
const moment = require("moment");
const db = require("../db");
const { isEmpty } = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create Comment for an article
 * @param {object} req
 * @param {object} res
 * @returns {object} object reflection
 */

const createArticleComment = async (req, res) => {
  const { user_id } = req.user;
  const { article_id } = req.body;
  const { comment } = req.body;

  const createdAt = moment(new Date());

  if (isEmpty(comment)) {
    errorMessage.error = "Enter a comment";
    return res.status(status.bad).send(errorMessage);
  }

  const createCommentQuery = `INSERT INTO comments(
        user_id, article_id, comment, created_on
    ) 
    VALUES ($1, $2, $3, $4) 
    returning *`;
  const values = [user_id, article_id, comment, createdAt];
  try {
    const { rows } = await db.query(createCommentQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "Article already exists";
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = "Unable to create comment";
    return res.status(status.error).send(errorMessage);
  }
};
/**
 * Get All Comments
 * @param {object} req
 * @param {object} res
 * @returns {object} array of comments
 */

const getAllComments = async (req, res) => {
  const getAllCommentsQuery = `SELECT * FROM comments ORDER BY id DESC `;

  try {
    const { rows } = await db.query(getAllCommentsQuery);
    const dbResponse = rows;
    // if (dbResponse[0] === undefined) {
    //   errorMessage.error = "No comments available";
    //   return res.status(status.notfound).send(errorMessage);
    // }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get One Comment
 * @param {object} req
 * @param {object} res
 * @returns {object} array of gifs
 */

const getOneArticleComments = async (req, res) => {
  // const { id } = req.params;
  const { article_id } = req.params;

  const findOneGifQuery = `SELECT * FROM comments WHERE article_id=$1`;
  try {
    const { rows } = await db.query(findOneGifQuery, [article_id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No comments available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Update A comment
 * @param {object} req
 * @param {object} res
 * @returns {object} updated comment
 */

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { comment, is_flagged } = req.body;

  const findCommentQuery = `SELECT * FROM comments WHERE id=$1`;
  const updateComment = `UPDATE comments SET comment=$1, is_flagged=$2 WHERE id=$3 RETURNING *`;
  try {
    const { rows } = await db.query(findCommentQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "comment cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this comment";
      return res.status(status.unauthorized).send(errorMessage);
    }
    const values = [comment, is_flagged, id];
    const response = await db.query(updateComment, values);
    const dbResult = response.rows[0];
    successMessage.data = dbResult;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Delete a comment
 * @param {object} req
 * @param {object} res
 * @returns {void} return response comment deleted
 */

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deleteCommentQuery = `DELETE FROM comments WHERE id=$1 AND user_id = $2 returning *`;
  try {
    const values = [id, user_id];
    const { rows } = await db.query(deleteCommentQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "No comment found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = "Comment Deleted Sucessfully";
    return res.send(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.error).send(error);
  }
};

module.exports = {
  createArticleComment,
  getAllComments,
  getOneArticleComments,
  updateComment,
  deleteComment,
};
