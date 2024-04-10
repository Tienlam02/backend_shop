const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          status: 401,
          success: 0,
          mess: "Token invalid or Expiresin",
        });
      req.user = decode;
      console.log(req.user);
      next();
    });
  } else {
    return res.status(401).json({
      success: 0,
      mess: "Required authentication",
    });
  }
};
const isAdmin = (req, res, next) => {
  const { role } = req.user;

  if (role == 0)
    res.status(401).json({
      success: 0,
      mess: "Require role admin",
    });
  next();
};
module.exports = {
  verifyToken,
  isAdmin,
};
