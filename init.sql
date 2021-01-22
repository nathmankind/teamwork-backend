CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
CREATE TABLE
IF NOT EXISTS users
(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4
(),
      email VARCHAR
(128) UNIQUE NOT NULL,
      password VARCHAR
(100) NOT NULL,
      first_name VARCHAR
(100) NOT NULL,
      last_name VARCHAR
(100) NOT NULL,
      gender VARCHAR
(100) NOT NULL,
      job_role VARCHAR
(100) NOT NULL,
      department VARCHAR
(100) NOT NULL,
      address VARCHAR
(200) NOT NULL,
      is_admin BOOL DEFAULT
(false),
      created_on TIMESTAMP DEFAULT NOW
() );


INSERT INTO users
    (email, password, first_name, last_name, gender, job_role, department, address, is_admin)
VALUES
    ('nathmankind@gmail.com', 'Tester123!', 'Nathaniel', 'Makinde', 'Male', 'Software Engineer', 'Information Technology', '34, layi haruna street, ikotun, lagos', true);

CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

CREATE TABLE
IF NOT EXISTS posts
(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4
(),
      user_id UUID NOT NULL,
      title VARCHAR NOT NULL,
      article VARCHAR NULL,
      gif VARCHAR NULL,
      createdat TIMESTAMP DEFAULT NOW
(),
      FOREIGN KEY
(user_id) REFERENCES "users"
(id) ON
DELETE CASCADE
  );


CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
CREATE TABLE
IF NOT EXISTS
  comments
(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4
(),
      post_id UUID NOT NULL,
      user_id UUID NOT NULL,
      comment VARCHAR NOT NULL,
      createdat TIMESTAMP DEFAULT NOW
(),
      FOREIGN KEY
(post_id) REFERENCES "posts"
(id) ON
DELETE CASCADE,
      FOREIGN KEY (user_id)
REFERENCES "users"
(id) ON
DELETE CASCADE
  );
