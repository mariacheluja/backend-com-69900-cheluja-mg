import jwt from "jsonwebtoken";

const PRIVATE_KEY = "s3cr3t";

export const generateToken = (user) => {
  const payload = {
    user,
  };

  return jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: "5m",
  });
};

export const authToken = (req, res, next) => {
  const token = req.cookies.currentUser;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Token no valido",
    });
  }
};
