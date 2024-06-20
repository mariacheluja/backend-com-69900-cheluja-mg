import { UserModel } from "./models/user.model.js";

export default class UserDaoMongoDB {

//asocio un user connun producto
  async addproductToUser(userId, productId){
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { product: productId } }, //metodo de mongoose para modificar el array
        { new: true }
      );
      /* ------------------------------------ - ----------------------------------- */
      // const user = await UserModel.findById(userId) // otra forma no usando metodos de mongoose
      // user.product.push(productId) //le agrego al array el producto nuevo insertado por el usuario
      // user.save()
      return user;
    } catch (error) {
      throw new Error(error)
    }
  }


  async getByEmail(email) {
    try {
      const response = await UserModel.find({ email: email });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const response = await UserModel.findById(id).populate("cart");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  //paginacion arranco por la pagina 1 y traigo 10 elementos async getAll se reemplzo por esto.
  async getByNameUser(page = 1, limit = 10) {
    try {
      const response = await UserModel.paginate({}, { page, limit }); //recibo los parametros de la paginacion
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      const response = await UserModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, obj) {
    try {
      await UserModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const response = await UserModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
