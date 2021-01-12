const db = require("../db");

db.on("connect", () => {
  console.log("connected to the db");
});

const seed = () => {
  const seedAdminUserQuery = `INSERT INTO
    users (
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
    VALUES('nathmankind@gmail.com',
     'admin@2020', 'nathaniel', 'makinde', 'male', 'developer', 
     'software', '34, layi haruna street, ikotun, lagos','true' )
    `;

  db.query(seedAdminUserQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const seedAdmin = () => {
  seed();
};

db.on("remove", () => {
  console.log("db removed");
  process.exit(0);
});

module.exports = { seedAdmin };

require("make-runnable");
