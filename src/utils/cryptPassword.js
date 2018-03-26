const bcrypt = require("bcrypt");

export const cryptPwd = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(new Error("HASHING ERROR"));
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(new Error("HASHING ERROR"));
        resolve(hash);
      });
    });
  });

export const comparePwd = (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
