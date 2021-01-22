const dbquery = require("../db-helpers/query");
const moment = require("moment");
const {
  hashPassword,
  isEmpty,
  isValidEmail,
  validatePassword,
  generateToken,
} = require("../helpers/validation");
const { errorMessage, successMessage, status } = require("../helpers/status");

/**
 * Create an admin
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */

const creatAdminUser = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    gender,
    job_role,
    department,
    address,
  } = req.body;

  const { is_admin } = req.user;
  const isAdmin = true;
  const dateCreated = moment(new Date());

  //check if user is an admin
  if (!is_admin === false) {
    errorMessage.message = "You are not authorized to create an admin";
    return res.status(status.unauthorized).send(errorMessage);
  }

  if (isValidEmail(email)) {
    errorMessage.message = "Invalid email, enter a valid email";
    return res.status(status.bad).send(errorMessage);
  }

  if (
    isEmpty(email) ||
    isEmpt(password) ||
    isEmpty(first_name) ||
    isEmpty(last_name) ||
    isEmpty(gender) ||
    isEmpty(job_role) ||
    isEmpty(department) ||
    isEmpty(address)
  ) {
    errorMessage.message = "All fields must have a value";
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.message = "Password must not be less than eight(8) characters";
    res.status(status.bad).send(errorMessage);
  }

  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
  users(
    email,
    password,
    first_name,
    last_name,
    gender,
    job_role,
    department,
    address, 
    is_admin, 
    created_on
    )
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  returning *`;
  const values = [
    email,
    hashedPassword,
    first_name,
    last_name,
    gender,
    job_role,
    department,
    address,
    isAdmin,
    dateCreated,
  ];
  try {
    const { rows } = await dbquery.query(createUserQuery, values);
    const db_response = rows[0];
    delete db_response.password;
    const token = generateToken(
      db_response.email,
      db_response.id,
      db_response.is_admin,
      db_response.first_name,
      db_response.last_name
    );
    successMessage.data = db_response;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      errorMessage.message = "Admin with the email already exist";
      return res.status(status.conflict).send(errorMessage);
    }
  }
};

export { creatAdminUser };
