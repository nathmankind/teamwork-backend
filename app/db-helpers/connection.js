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

//    \
const createArticleTable = () => {
  const createArticleQuery = `CREATE TABLE IF NOT EXISTS articles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    article TEXT NOT NULL,
    is_flagged BOOL DEFAULT(false),
    created_on DATE NOT NULL
  )`;
  db.query(createArticleQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createGifTable = () => {
  const createGifQuery = `CREATE TABLE IF NOT EXISTS gifs(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    gif VARCHAR(100) NOT NULL,
    is_flagged BOOL DEFAULT(false),
    created_on DATE NOT NULL
  )`;
  db.query(createGifQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};


const createFeedTable = () => {
  const createFeedQuery = `CREATE TABLE sample_feeds(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feed_content TEXT DEFAULT(null),
    is_flagged BOOL DEFAULT(false),
    created_on DATE NOT NULL
  )`
  db.query(createFeedQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
}


/**
 * Query to combine article and gif table
 */
// INSERT INTO sample_feeds(user_id, feed_content,is_flagged, created_on)
// SELECT a.user_id, a.article, a.is_flagged, a.created_on 
// FROM articles a
// UNION ALL
// SELECT g.user_id, g.gif, g.is_flagged, g.created_on 
// FROM gifs g;



const createGifCommentTable = () => {
  const createGifCommentQuery = `CREATE TABLE IF NOT EXISTS gifcomments(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    gif_id INTEGER REFERENCES gifs(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_flagged BOOL DEFAULT(false),
    created_on DATE NOT NULL
  )`;
  db.query(createGifCommentQuery)
    .then((res) => {
      console.log(err);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};


const createCommentsTable = () => {
  const createCommentQuery = `CREATE TABLE IF NOT EXISTS comments(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_flagged BOOL DEFAULT(false),
    created_on DATE NOT NULL
  )`;

  db.query(createCommentQuery)
    .then((res) => {
      console.log(err);
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
