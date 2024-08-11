import Joi from "joi";

export const cartDto = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().required(),
    })
  ),
});
