// Importaciones necesarias
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; // Importo el paginador de mongoose**
import { Schema, model } from "mongoose";
import { initMongoDB } from '../../mongodb/connection.js'; 


// Definición del esquema de usuario
const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    index: true
  },
  last_name: { 
    type: String, 
    required: true 
  },
  age: {
    type: Number,
    required: false, 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 4000
  },
  role: { 
    type: String, 
    required: true, 
    default: "user" 
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product', 
      default: []
    }
  ],
  githubId: { 
    type: String 
  },
  // Agrega el campo de referencia al carrito (cart) 
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  } 


}, {
    timestamps: true,
  }

);


UserSchema.plugin(mongoosePaginate);

// Pre middleware para el método find y findOne
UserSchema.pre('find', function() {
  this.populate('products');
});

UserSchema.pre('findOne', function() {
  this.populate('products');
});

// Exportamos el modelo de usuario
export const UserModel = model('User', UserSchema);



// // Importaciones necesarias
// import mongoose from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2'; // Importo el paginador de mongoose
// import { Schema, model } from 'mongoose';

// // Definición del esquema de usuario
// const UserSchema = new Schema({
//   first_name: {
//     type: String,
//     required: true,
//     index: true
//   },
//   last_name: { 
//     type: String, 
//     required: true 
//   },
//   age: {
//     type: Number,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//     maxlength: 20
//   },
//   role: { 
//     type: String, 
//     required: true, 
//     default: "user" 
//   },
//   products: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'product', 
//       default: []
//     }
//   ],
//   githubId: { 
//     type: String 
//   }
//   // Falta el cart id con referencia a cart
// });

// // Inicializamos el paginate
// UserSchema.plugin(mongoosePaginate);

// // Pre middleware para el método find
// UserSchema.pre('find', function() {
//   this.populate('products');
// });

// // Exportamos el modelo de usuario
// export const UserModel = model('User', UserSchema);
