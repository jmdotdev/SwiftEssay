import jwt from "jsonwebtoken"

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "mysecretkey", (err, decoded) => {
        if (err) {
          reject('Invalid token');
        } else {
          resolve(decoded);
        }
      });
    });
  };
