// ojo lo pase a views.router.js ojo con las rutas


import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const isSession = req.session.user ? false : true;
  res.render("index", {
    title: "Inicio",
    isSession,
  });
});

router.get("/login", (req, res) => {
  const isSession = req.session.user ? false : true;
  if (!isSession) {
    return res.redirect("/");
  }

  res.render("login", {
    title: "Login",
  });
});

router.get("/register", (req, res) => {
  const isSession = req.session.user ? false : true;

  if (!isSession) {
    return res.redirect("/");
  }

  res.render("register", {
    title: "Registro",
  });
});

router.get("/profile", (req, res) => {
  const isSession = req.session.user ? false : true;

  if (isSession) {
    return res.redirect("/");
  }

  res.render("profile", {
    title: "Perfil",
    user: req.session.user,
  });
});

export default router;
