import { Router } from "express";
import { userModel } from "../models/user.model.js";
import passport from "passport";

const router = Router();

// Login Passport
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failLogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).send({ message: "No autorizado" });
    }
    
// colocamos los datos menos la contraseña

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };

    res.send({ message: "Sesión iniciada" });
  }
);

router.get("/failLogin", (req, res) => {
  res.status(401).send({ message: "Error al iniciar sesión" });
});

// Register passport
router.post(
  "/register", // nombre que proviene de passport.config.js
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    res.status(201).send({ message: "Usuario registrado" });
  }
);

// mensaje si se registro mal, defino la ruta aca.

router.get("/failRegister", (req, res) => {
  res.status(401).send({ message: "Error al registrar" });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Sesión cerrada" });
});

export default router;
