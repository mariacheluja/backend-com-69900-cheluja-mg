// import passport from "passport";
// import local from "passport-local";
// import GithubStrategy from "passport-github2";
// import {hasPassword, comparePassword} from "../utils/hashFuntions.js";
// import { userModel } from "../models/user.model.js";

// //primero instanciamos

// const LocalStrategy = local.Strategy;

// // register stratregy, recibe el nombre register 

// export const initializePassport = () => {
//   passport.use(
//     "github",
//     new GithubStrategy(
//       {
//         clientID: "",
//         clientSecret: "",
//         callbackURL: "http://localhost:8080/api/sessions/githubCallback",
//         scope: ["user:email"],
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           console.log(profile);

//           const user = await userModel.findOne({
//             email: profile.emails[0].value,
//           });

//           if (user) {
//             return done(null, user);
//           }

//           const newUser = await userModel.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             age: profile.age,
//             githubId: profile.id,
//           });

//           return done(null, newUser);
//         } catch (error) {
//           done(error);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });

//   passport.deserializeUser((id, done) => {
//     userModel.findById(id, (err, user) => {
//       done(err, user);
//     });
//   });
// };



//const initializePassport = () => {
// passport.use(
//     "register", // debo respetar este nmbre el routes session.js

//     new LocalStrategy(
//       {
//         usernameField: "email",
//         passReqToCallback: true,
//       },
//       async (req, username, password, done) => {
//         const { first_name, last_name, age } = req.body;

//         if (!first_name || !last_name || !age) {
//           return res.status(400).json({ error: "Falta información" });
//         }
//         try {
//           const user = await userModel.findOne({ email: username });

//           if (user) {
//             done(null, false, { message: "El usuario ya existe" });
//             return;
//           }

//           const hashPassword = createHash(password);

//           // Se  guarda en la colección de usuarios auque tambien los puedo guardar en la db
//           const newUser = await userModel.create({
//             first_name,
//             last_name,
//             email: username,
//             age,
//             password: hashPassword, // uso la contraseña haseada
//           });

//           return done(null, newUser);
//         } catch (error) {
//           done(error);
//         }
//       }
//     )
//   );

//   passport.use(
//     "login",
//     new LocalStrategy(
//       {
//         usernameField: "email",
//       },
//       async (username, password, done) => {
//         console.log(username);
//         console.log(password);
//         console.log(done.toString());
//         try {
//           const user = await userModel.findOne({ email: username });

//           if (!user) {
//             return done(null, false, { message: "Usuario no encontrado" });
//           }

//           if (!comparePassword(password, user.password)) {
//             return done(null, false, { message: "Contraseña incorrecta" });
//           }

//           return done(null, user);
//         } catch (error) {
//           done(error);
//         }
//       }
//     )
//   );

//   // serializar y deserializar el usuario
//   // serializeUser es lo que se guarda en la cookie
//   // deserializeUser es lo que se recupera al iniciar sesion o hacer logout 
//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });  // retorna el usuario

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await userModel.findById(id);
//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   });
// };

// export { initializePassport };

import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import {  createHash, comparePassword } from "../utils/hashFuntions.js";
import {UserModel } from "../daos/mongodb/models/user.model.js";
import jwt from "jsonwebtoken";
import jwtStrategy from "passport-jwt";
// Instanciamos LocalStrategy
const LocalStrategy = local.Strategy;
const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

// Función para inicializar Passport
const initializePassport = () => {
  // Estrategia de GitHub
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv23lidIuZVuDWYG4jNp",
        clientSecret: "a96ed0f36e43801142d7c3f4c1988b9164d37567",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
        scope: ["user:email"],  // nos permite recuperar el mail
      },
      async (accessToken, refreshToken, profile, done) => { // configuramos los parametros que recibe
        try {
          console.log(profile);

          const user = await UserModel.findOne({
            email: profile.emails[0].value,
          });

          if (user) {
            return done(null, user);
          }

          const newUser = await UserModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            githubId: profile.id,
          });

          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Estrategia de registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;

        if (!first_name || !last_name || !age) {
          return done(null, false, { message: "Falta información" });
        }

        try {
          const user = await UserModel.findOne({ email: username });

          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const hashedPassword = hashPassword(password);

// devuelve el usuario cuando conectamos a gitrhub

          const newUser = await UserModel.create({
            first_name,
            last_name,
            email: username,
            age,
            password: hashedPassword,
          });
          
// retornamos con un done si no tira error

          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Estrategia de login
  passport.use(
    "login",
    new LocalStrategy(
      
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
          try {
            const user = await userModel.findOne({ email });
  
            if (!user) {
              return done(null, false, { message: "Usuario no encontrado" });
            }
  
            if (!(await comparePassword(password, user.password))) {
              return done(null, false, { message: "Contraseña incorrecta" });
            }
  
            return done(null, user);
          } catch (error) {
            done(error);
        }
      }
    )
  );

 


  // Serialización del usuario, si o si cuando trabajamos con estrategias locales.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialización del usuario
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });


passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: "s3cr3t",
    },
    async (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        return done(error);
      }
    }
  )
);
};


function cookieExtractor(req) {
let token = null;
if (req && req.cookies) {
  token = req.cookies["token"];
}

return token;
}


export { initializePassport };
