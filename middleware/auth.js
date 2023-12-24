const jwt = require("jsonwebtoken");
const verifyJwt = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("Token is require");
  }
  let key = "westride123";
  console.log(token);
  try {
    token = token.split(" ");
    let decode = jwt.verify(token[1], key);
    console.log(decode, "<<<decode");
    req._user = decode;
    next();
  } catch (error) {
    console.log(token);
    console.log(error);
    return res.status(401).send(error);
  }
};

module.exports = verifyJwt;
