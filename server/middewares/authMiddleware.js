import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const decoded = jwt.verify(token, "mysecretkey");
    console.log("decoded",decoded)
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
