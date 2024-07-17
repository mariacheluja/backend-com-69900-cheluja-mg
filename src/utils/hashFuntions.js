import bcrypt from "bcrypt";


// funcion sincronica de creacion de contraseña como pide la consigna. tener en cuenta que las funciones sincronicas son bloqueantes
// como la aplicacionn es chica la podemos hacer sincronica, si no la tendriamos que  hacer asincronica.
// por defoult el genSaltSync es 10

export function createHash(password) {
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  return hashPassword;
}

// funcion sincronica de comparacion de passwords, devuelve un booleano.
// la asincronica es igual sin el sync.

export function comparePassword(password, hashPassword) {
  const isPasswordCorrect = bcrypt.compareSync(password, hashPassword);

  return isPasswordCorrect;
}
