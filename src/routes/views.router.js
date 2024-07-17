
// import { Router } from "express";

// const router = Router();

// router.get('/', (req, res) => {
//     res.render('chat');
// });

// router.get('/vista1', (req, res) => {
//     res.render('vista1');
// });

// router.get('/vista2', (req, res) => {
//     res.render('vista2', { layout: 'realTimeProducts.handlebars' });
// });

// router.get('/Home', (req, res) => {
//     res.render('Home');
// });

// router.get('/realTimeProducts', (req, res) => {
//     res.render('realtimeproducts');
// });

// // Ruta para obtener productos en tiempo real
// router.get('/realTimeProducts', async (req, res) => {
//     try {
//         const products = await productsManager.getProducts();
//         res.render('realTimeProducts', { products });
//     } catch (error) {
//         console.error('Error al obtener productos:', error);
//         res.status(500).send('Error al obtener productos');
//     }
// });



// router.get("/", (req, res) => {
//   res.render("home", { user: req.session.user });
// });

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get('/current', (req, res) => {
//     res.render('current');
// });

// router.get("/", (req, res) => {
//     const isSession = req.session.user ? false : true;
//     res.render("index", {
//       title: "Inicio",
//       isSession,
//     });
//   });
  
//   router.get("/login", (req, res) => {
//     const isSession = req.session.user ? false : true;
//     if (!isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("login", {
//       title: "Login",
//     });
//   });
  
//   router.get("/register", (req, res) => {
//     const isSession = req.session.user ? false : true;
  
//     if (!isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("register", {
//       title: "Registro",
//     });
//   });
  
//   router.get("/profile", (req, res) => {
//     const isSession = req.session.user ? false : true;
  
//     if (isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("profile", {
//       title: "Perfil",
//       user: req.session.user,
//     });
//   });
  

//   router.get("/", (req, res) => {
//     const isSession = req.session.user ? false : true;
//     res.render("index", {
//       title: "Inicio",
//       isSession,
//     });
//   });
  
//   router.get("/login", (req, res) => {
//     const isSession = req.session.user ? false : true;
//     if (!isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("login", {
//       title: "Login",
//     });
//   });
  
//   router.get("/register", (req, res) => {
//     const isSession = req.session.user ? false : true;
  
//     if (!isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("register", {
//       title: "Registro",
//     });
//   });
  
//   router.get("/profile", (req, res) => {
//     const isSession = req.session.user ? false : true;
  
//     if (isSession) {
//       return res.redirect("/");
//     }
  
//     res.render("profile", {
//       title: "Perfil",
//       user: req.session.user,
//     });
//   });

//   router.get("/", (req, res) => {
//     if (!req.cookies.currentUser) {
//       res.render("login");
//     } else {
//       res.redirect("/current");
//     }
//   });
  
//   router.get("/current", authToken, (req, res) => {
//     if (req.user) {
//       res.render("current", { user: req.user });
//     } else {
//       res.redirect("/");
//     }
//   });
  

// export default router;


import { Router } from "express";

import { authToken, generateToken} from "../utils/jwtFuntions.js";

const router = Router();

// Rutas para renderizar vistas
router.get('/', (req, res) => {
    const isSession = req.session.user ? false : true;
    res.render("index", {
      title: "Inicio",
      isSession,
    });
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/vista1', (req, res) => {
    res.render('vista1');
});

router.get('/vista2', (req, res) => {
    res.render('vista2', { layout: 'realTimeProducts.handlebars' });
});

router.get('/home', (req, res) => {
    res.render('Home');
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/login', (req, res) => {
    const isSession = req.session.user ? false : true;
    if (!isSession) {
        return res.redirect("/");
    }
    res.render("login", {
      title: "Login",
    });
});

router.get('/register', (req, res) => {
    const isSession = req.session.user ? false : true;
    if (!isSession) {
        return res.redirect("/");
    }
    res.render("register", {
      title: "Registro",
    });
});

router.get('/profile', (req, res) => {
    const isSession = req.session.user ? false : true;
    if (isSession) {
        return res.redirect("/");
    }
    res.render("profile", {
      title: "Perfil",
      user: req.session.user,
    });
});

router.get('/current', (req, res) => {
    if (!req.cookies.currentUser) {
        res.render("login");
    } else {
        res.redirect("/current");
    }
});

router.get('/current', authToken, (req, res) => {
    if (req.user) {
        res.render("current", { user: req.user });
    } else {
        res.redirect("/");
    }
});

export default router;
