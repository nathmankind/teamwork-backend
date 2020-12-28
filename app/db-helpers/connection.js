const db = require("../db");

db.on("connect", () => {
  console.log("connected to the db");
});

const createUserTable = () => {
  const createUserQuery = `CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(128) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      gender VARCHAR(100) NOT NULL,
      job_role VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      address VARCHAR(200) NOT NULL,
      is_admin BOOL DEFAULT(false),
      created_on DATE NOT NULL )`;

  db.query(createUserQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const dropUserTable = () => {
  const usersDropQuery = "DROP TABLE IF EXISTS users";
  db.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createAllTables = () => {
  createUserTable();
};
const dropAllTables = () => {
  dropUserTable();
};

db.on("remove", () => {
  console.log("db removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
