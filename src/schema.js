import {schema,model} from mongoose  //definimos los campos a usar.
const UserSchema = new schema({
    fistname: { type: String, required: true },
    lastname: { type: String, required: true }, 
    age:{type:Number,required:true}     
})  

export const UserModel = model('User',UserSchema); //llamamos al metodo model y le decimos que use la colección user y el esquema que va a usar. Aca vamos a tener un esquema para carrito, uno para usuario, etc
