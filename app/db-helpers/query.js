const db = require("../db");

// export default {
//   /**
//    * DB Query
//    * @param {object} req
//    * @param {object} res
//    * @returns {object} object
//    */

//   query(queryText, params) {
//     return new Promise((resolve, reject) => {
//       db.query(queryText, params)
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };

const query = (queryText, params) => {
  return new Promise((resolve, reject) => {
    db.query(queryText, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = query;
