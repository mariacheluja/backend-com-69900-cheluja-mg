import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; //importo el metodo paginate de mongoose

export const productCollectionName = "products";

export const productSchema = new Schema({
  title: { type: String, required: true },   // respeto mi esquema
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollectionName, productSchema);
