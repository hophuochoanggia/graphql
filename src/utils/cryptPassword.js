var bcrypt = require("bcrypt");
const salt = "12345";
export const cryptPwd = password => {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        resolve(hash);
      });
    });
  });
};

export const comparePwd = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};
