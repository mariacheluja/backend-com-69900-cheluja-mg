import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importo el plugin de paginación de mongoose**

export const productCollectionName = "products";

export const productSchema = new Schema(
  {
    title: { type: String, required: true },   // Respetar el esquema
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Corregi el  "require" a "required"**
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollectionName, productSchema);
