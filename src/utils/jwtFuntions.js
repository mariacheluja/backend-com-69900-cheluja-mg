import jwt from "jsonwebtoken";
// se deberia colocar en una variable de entorno
const PRIVATE_KEY = "s3cr3t";
// Genera un token y el payload es lo que contiene nuestro token
export const generateToken = (user) => {
  const payload = {
    user,
  };

  return jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: "5m",
  });
};
// Middleware que  verifica que el token exista
// Chequeamos que el token exista y sea válido hay varias formas de escribirlos Authorization es valida o entre corchetea tb.
export const authToken = (req, res, next) => {
  //const token2 = req.cookies.currentUser;
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.redirect("/");
    return res.status(401).json({
      error: "Falta token",
    });
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
