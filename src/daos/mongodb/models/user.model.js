//importaciones necesarias
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; //importo el paginete de mongoose


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
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
    maxlength: 20
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product', 
      default: []
    }
  ]
});

UserSchema.plugin(mongoosePaginate); // inicializamos el paginate

UserSchema.pre('find', function() {
  this.populate('products');
});

export const UserModel = mongoose.model('User', UserSchema);
