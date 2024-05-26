const socket = io();

let username = null;  // Inicializo la variable para llamar a SweetAlert

if (!username) {
  Swal.fire({
    title: "¡Welcome to Shopping Cart!",
    input: "text",
    text: 'Insert your username:',
    inputValidator: (value) => {
      if (!value) {
        return "Your username is required"; // Mensaje de error 
      }
    }
  }).then((input) => {
    username = input.value; // La variable username toma el valor de input
    socket.emit('newUser', username); // Mandamos el username como evento al server para que lo guarde
  });
}

const inputMessage = document.getElementById('message');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const actions = document.getElementById('actions');

btn.addEventListener('click', () => {
  const newMessage = {
    username,
    message: inputMessage.value
  };
  socket.emit('chat:message', newMessage);
  inputMessage.value = ''; // Inicializo el string vacío
});

socket.on('messages', (data) => { // Escuchamos el evento que viene del server obj data
  actions.innerHTML = '';  // Actions es el mismo del HTML
  output.innerHTML = data.map((msg) => {
    return `<p><strong>${msg.username}</strong>: ${msg.message}</p>`;
  }).join(' ');
});

socket.on('newUser', (username) => { // Escucho el username y lo muestro con Toastify
  Toastify({
    text: `🟢 ${username} is logged in`,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () { } // Callback after click
  }).showToast();
});

inputMessage.addEventListener('keypress', () => {
  socket.emit('chat:typing', username);
});

socket.on('chat:typing', (usernameTyp) => {
  actions.innerHTML = `<p>${usernameTyp} is writing a message...</p>`;
});

socket.on('products', async (products) => {
  // Clear existing product list
  productsList.innerHTML = '';

  // Render the product list
  for (const product of products) {
    const productListItem = document.createElement('li');
    productListItem.textContent = `${product.name} - Price: ${product.price}`;
    productsList.appendChild(productListItem);

    // Add event listener to add product to cart
    productListItem.addEventListener('click', () => {
      const cartId = 'ID_DEL_CARRITO'; // Reemplaza con el ID del carrito actual
      socket.emit('addProductToCart', { cartId, productId: product.id });
    });
  }
});

socket.on('productAdded', (updatedCart) => {
  console.log('Product added to cart:', updatedCart);
});

socket.on('error', (errorMessage) => {
  console.error('Error:', errorMessage);
});



