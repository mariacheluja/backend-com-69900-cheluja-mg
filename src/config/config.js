import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000, // Añade un valor por defecto en caso de que `PORT` no esté definido
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp", // Añade un valor por defecto para `MONGO_URI`
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret", // Añade un valor por defecto para `JWT_SECRET`
  secret: process.env.SECRET || "secret",
  mailer: {
    host: process.env.MAILER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.MAILER_PORT, 10) || 465, 
    auth: {
      user: process.env.MAILER_USERNAME || "default_user@gmail.com", // Añade un valor por defecto para `MAILER_USERNAME`
      pass: process.env.MAILER_PASSWORD || "default_password", // Añade un valor por defecto para `MAILER_PASSWORD`
    },
  },
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "default_account_sid", // Añade un valor por defecto para `TWILIO_ACCOUNT_SID`
    authToken: process.env.TWILIO_AUTH_TOKEN || "default_auth_token", // Añade un valor por defecto para `TWILIO_AUTH_TOKEN`
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "+1234567890", // Añade un valor por defecto para `TWILIO_PHONE_NUMBER`
  },
};


// import dotenv from "dotenv";

// dotenv.config();

// export const config = {
//   PORT: process.env.PORT,
//   MONGO_URI: process.env.MONGO_URI,
//   JWT_SECRET: process.env.JWT_SECRET,
//   secret: process.env.SECRET || "secret",
//   mailer: {
//     host: process.env.MAILER_HOST || "smtp.gmail.com",
//     port: process.env.MAILER_PORT || 465,
//     auth: {
//       user: process.env.MAILER_USERNAME,
//       pass: process.env.MAILER_PASSWORD,
//     },
//   },
//   sms: {
//     accountSid: process.env.TWILIO_ACCOUNT_SID,
//     authToken: process.env.TWILIO_AUTH_TOKEN,
//     phoneNumber: process.env.TWILIO_PHONE_NUMBER,
//   },

// };
