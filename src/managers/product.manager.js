//hago la importaciones necesarias
// el archivo manager maneja los metodos de productos

import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // funcion para consultar los productos
  async getProducts(limit = undefined) {
    try {
        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, "utf8");
            let parsedProducts = JSON.parse(products);
            
            // Verificar si se proporciona un límite y es un número válido
            if (limit !== undefined && !isNaN(limit)) {
                // Cortar el array según el límite proporcionado
                return parsedProducts.slice(0, parseInt(limit));
            }
            
            // Si no se proporciona un límite válido, devolver todos los productos
            return parsedProducts;
        } else {
            // Si no existe el archivo, devolver un array vacío
            return [];
        }
    } catch (error) {
        console.log(error);
        // En caso de error, devolver un array vacío
        return [];
    }
}

  // funcion para crear productos y darles un id
  async createProduct({ title, description, code, price, stock, category }) {
    try {
        const product = {
            id: uuidv4(),
            status: true,
            title,
            description,
            code,
            price: parseFloat(price),
            stock: parseInt(stock),
            category
        };
        const products = await this.getProducts();
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return product;
    } catch (error) {
        console.log(error);
    }
}

  // funcion para consultar productos por id
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const productExist = products.find((p) => p.id === id);
      if (!productExist) return null;
      return productExist;
    } catch (error) {
      console.log(error);
    }
  }

  // funcion para actualizar el array de productos


  async updateProduct(obj, id) {
    try {
      const products = await this.getProducts();
      let productExist = await this.getProductById(id);
      if (!productExist) return null;
      productExist = { ...productExist, ...obj };
      const newArray = products.filter((u) => u.id !== id);
      newArray.push(productExist)
      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      return productExist;
    } catch (error) {
      console.log(error);
    }
  }


  // funcion para eliminar productos por id


  async deleteProduct(id) {
    const products = await this.getProducts();
    if (products.length > 0) {
      const productExist = await this.getProductById(id);
      if (productExist) {
        const newArray = products.filter((u) => u.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
        return productExist
      } 
    } else return null
  }



  async deleteFile() {
    try {
      await fs.promises.unlink(this.path);
      console.log("archivo eliminado");
    } catch (error) {
      console.log(error);
    }
  }
}

export const productsManager = new ProductManager('path/to/products.json');
