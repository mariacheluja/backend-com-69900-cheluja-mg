import { Router } from "express";
import { userModel } from "../daos/mongodb/models/user.model.js";
import { comparePassword } from "../utils/hashFuntions.js";
import { generateToken } from "../utils/jwtFuntions.js";
import { createHash } from "../utils/hashFuntions.js";
import passport from "passport";

const router = Router();
// estrategia con login podemos hacer lo mismo con register 
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

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/auth/login",
  }),
  async (req, res) => {
    const payload = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    };

    const token = generateToken(payload);

// para usar las cokies porque lo pide el entregable.

    res.cookie("token", token, {
      maxAge: 100000,
      httpOnly: true, // para que acceda solo por metodos http.
    });

    res.status(200).json({
      message: "Login success",
      token,
    });
  }
);

router.get("/login", (req, res) => {
  res.status(401).json({
    error: "Unauthorized",
  });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, role, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({
      error: "Missing fields",
    });
  }

  try {
    // Hashear contraseña
    const hashPassword = await createHash(password);

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el usuario", details: error.message });
  }
});

//para proteger los users

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    res.status(200).json({
      message: "Bienvenido",
      user: req.user,
    });
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Sesión cerrada",
  });
});



export default router;