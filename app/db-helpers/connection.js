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

//    \
// const createArticleTable = () => {
//   const createArticleQuery = `CREATE TABLE IF NOT EXISTS articles(
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     article TEXT NOT NULL,
//     is_flagged BOOL DEFAULT(false),
//     created_on DATE NOT NULL
//   )`;
//   db.query(createArticleQuery)
//     .then((res) => {
//       console.log(res);
//       db.end();
//     })
//     .catch((err) => {
//       console.log(err);
//       db.end();
//     });
// };

// const createGifTable = () => {
//   const createGifQuery = `CREATE TABLE IF NOT EXISTS gifs(
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     gif VARCHAR(100) NOT NULL,
//     is_flagged BOOL DEFAULT(false),
//     created_on DATE NOT NULL
//   )`;
//   db.query(createGifQuery)
//     .then((res) => {
//       console.log(res);
//       db.end();
//     })
//     .catch((err) => {
//       console.log(err);
//       db.end();
//     });
// };

// const createPostTableQuery = `
//     CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
//     CREATE TABLE IF NOT EXISTS
//     posts(
//         id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
//         user_id UUID NOT NULL,
//         title VARCHAR NOT NULL,
//         article VARCHAR NULL,
//         gif VARCHAR NULL,
//         createdat TIMESTAMP DEFAULT NOW(),
//         FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
//     )
// `;

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

// const createGifCommentTable = () => {
//   const createGifCommentQuery = `CREATE TABLE IF NOT EXISTS gifcomments(
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     gif_id INTEGER REFERENCES gifs(id) ON DELETE CASCADE,
//     comment TEXT NOT NULL,
//     is_flagged BOOL DEFAULT(false),
//     created_on DATE NOT NULL
//   )`;
//   db.query(createGifCommentQuery)
//     .then((res) => {
//       console.log(err);
//       db.end();
//     })
//     .catch((err) => {
//       console.log(err);
//       db.end();
//     });
// };

// const createCommentsTable = () => {
//   const createCommentQuery = `CREATE TABLE IF NOT EXISTS comments(
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
//     comment TEXT NOT NULL,
//     is_flagged BOOL DEFAULT(false),
//     created_on DATE NOT NULL
//   )`;

//   db.query(createCommentQuery)
//     .then((res) => {
//       console.log(err);
//       db.end();
//     })
//     .catch((err) => {
//       console.log(err);
//       db.end();
//     });
// };

const createAllTables = () => {
  createUserTable();
};

db.on("remove", () => {
  console.log("db removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
