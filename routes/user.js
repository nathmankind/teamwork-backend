const express = require("express");
const router = express.Router();
const { createUser, signinUser } = require("../app/controllers/user");

//get all users
// router.get("/", async function (req, res, next) {
//   try {
//     const results = await db.query("SELECT * FROM users");
//     return res.json(results.rows);
//   } catch (error) {
//     return next(error);
//   }
// });
// router.post("/", async (req, res, next) => {
//   try {
//     const result = await db.query(
//       "INSERT INTO users (email, password, userType) VALUES ($1,$2,$3) RETURNING *",
//       [req.body.email, req.body.password, req.body.userType]
//     );
//     return res.json(result.rows[0]);
//   } catch (error) {
//     return next(error);
//   }
// });

router.post("/signup", createUser);
router.post("/login", signinUser);

module.exports = router;
