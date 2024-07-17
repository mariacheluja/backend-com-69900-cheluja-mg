//router de session esta repetido en session.routes.js ojo ver rutas

import { Router } from "express";
import { UserModel } from "../daos/mongodb/models/user.model.js";
import passport from "passport";

const router = Router();

router.get("/github", (req,res) => {});

// colocar el nombre tal cual en github, si no da error en el endopoint y se rompe todo

  router.get("githubCallback", async (req, res) => {
    if (req.user) {
      res.session.user = req.user;
      return res.redirect("/");
    }
    res.redirect("/login");
  });

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
  "/register",
  passport.authenticate("register", { // nombre que proviene de passport.config.js
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


//estrategia de autenticacion con github



router.get("/github", passport.authenticate("github"));

router.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    if (req.user) {
      req.session.user = req.user;
      return res.redirect("/");
    }

    res.redirect("/login");
  }
);

export default router;
