const db = require("../db");

db.on("connect", () => {
  console.log("connected to the db");
});

const createUserTable = () => {
  const createUserQuery = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
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

const createPostTable = () => {
  const createPostQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS
  posts(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      title VARCHAR NOT NULL,
      article VARCHAR NULL,
      gif VARCHAR NULL,
      createdat TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
  )`;
  db.query(createPostQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createCommentTable = () => {
  const createCommentQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS
  comments(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      post_id UUID NOT NULL,
      user_id UUID NOT NULL,
      comment VARCHAR NOT NULL,
      createdat TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (post_id) REFERENCES "posts" (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
  )`;
  db.query(createCommentQuery)
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
  createUserTable(), createPostTable(), createCommentTable();
};

db.on("remove", () => {
  console.log("db removed");
  process.exit(0);
});

module.exports = { createAllTables };

require("make-runnable");
