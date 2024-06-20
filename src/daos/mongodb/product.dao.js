
import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {

  // aca el get all recibe el page y el limit de 10
  async getAll(page = 1, limit = 10, title, category, sort) {
    try {
      // Corrección: Definir el filtro correctamente busca por title y si no devuelve toodo
      const filter = title ? { title: title } : {};
      if (category) filter.category = category; // Agregar la categoría al filtro si existe
      
      // Corrección: Ajustar el orden de clasificación y lo hacemos por precio
      let sortOrder = {};
      if (sort) sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ?-1:null; // Aceptar solo 'asc' o 'desc'
      
      const response = await ProductModel.paginate(filter, { page, limit, sort: sortOrder });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(prodid) {
    try {
      const response = await ProductModel.findById(prodid);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      const response = await ProductModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
// actualiza un producto por su id

  async update(prodid, obj) {
    try {
      const response = await ProductModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(prodid) {
    try {
      const response = await ProductModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
