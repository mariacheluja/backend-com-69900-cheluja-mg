import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { comparePassword } from "../utils/hashFunctions.js";
import { generateToken } from "../utils/jwtFunctions.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Falta el email o la contraseña",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    if (!comparePassword(password, user.password)) {
      return res.status(401).json({
        error: "Contraseña incorrecta",
      });
    }

    const token = generateToken({ email: user.email, role: user.role });

    res.cookie("currentUser", token, { maxAge: 100000 });

    // res.status(200).json({
    //   message: "Sesión iniciada",
    //   token,
    // });
    res.redirect("/current");
  } catch (error) {
    res.status(500).json({
      error: "Error al iniciar sesión",
    });
  }
});


const authToken = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login');
  }
};


export default router;