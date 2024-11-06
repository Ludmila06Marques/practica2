import ProductoDescargable from "./ProductoDescargable";

class Carrito {
    constructor() {
        this.carrito = []; // Inicializa el carrito como un array vacío
    }

    // Muestra los productos en el carrito. Si se pasa un carrito filtrado, lo muestra, si no, muestra todo el carrito
    mostrar(carritoFiltrado = this.carrito, productos) {
        const liastadoCarrito = document.getElementById('cart-items');
        liastadoCarrito.innerHTML = ''; // Limpia la lista del carrito

        if (this.carrito.length === 0) {
            liastadoCarrito.innerHTML = '<h4>CARRITO VACÍO</h4>';
            return;
        }
        carritoFiltrado.forEach((itemCarrito) => {
            const producto = productos.find(p => p.id === itemCarrito.id); // Encuentra el producto original
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';

            const divProducto = document.createElement('div');
            divProducto.className = 'product';

            // Añade el nombre del producto
            divProducto.innerHTML = `
                <div class="name"><h4>${producto.nombre}</h4></div>
            `;

            // Añade información adicional del producto
            if (producto instanceof ProductoDescargable) {
                if (producto.tamano_archivo) {
                    divProducto.innerHTML += `<div class="info"><h5>Tamaño del archivo: ${producto.tamano_archivo}</h5></div>`;
                }
            } else if (producto.peso) {
                divProducto.innerHTML += `<div class="info"><h5>Peso: ${producto.peso} Kg</h5></div>`;
            }

            // Añade stock y precio
            divProducto.innerHTML += `
                <div class="info"><h5>Hay ${producto.stock} unidades</h5></div>
                <div class="price"><h4>R$ ${producto.precio}</h4></div>
                <div class="price"><h4>Total: R$ ${producto.precio * itemCarrito.cantidad}</h4></div>
            `;

            // Sección para cantidad y controles
            divProducto.innerHTML += `
                <div class="quantities" style="position: relative;">
                    <div class="button minus">-</div>
                    <div class="quantity">
                        <input style="width: 50px; background-color:rgb(172, 168, 168);" type="number" min="0" value="${itemCarrito.cantidad}" id="quantity-${producto.id}">
                    </div>
                    <div class="button plus">+</div>
                    <div class="remove-button" style="position:absolute; right:5px; bottom:5px; cursor:pointer;"><span>🗑</span></div>
                </div>
            `;

            // Añade el tipo del producto
            divProducto.innerHTML += `<div class="type"><h4>${producto instanceof ProductoDescargable ? 'Producto descargable' : 'Producto físico'}</h4></div>`;

            // Añade eventos a los botones
            const botonMenos = divProducto.querySelector(".minus");
            const botonMas = divProducto.querySelector(".plus");
            const inputCantidad = divProducto.querySelector(`#quantity-${producto.id}`);
            const botonBorrar = divProducto.querySelector(".remove-button");

            // Evento para eliminar el producto del carrito
            botonBorrar.addEventListener("click", () => {
                this.cambiarCantidadProducto(producto.id, productos, 0);
                this.actualizarTotal();
                this.mostrar(this.carrito, productos);
            });

            // Evento para cambiar la cantidad al presionar Enter
            inputCantidad.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    let cantidadActual = parseInt(inputCantidad.value);
                    this.cambiarCantidadProducto(producto.id, productos, cantidadActual);
                    this.actualizarTotal();
                    this.mostrar(this.carrito, productos);
                }
            });

            // Evento para reducir la cantidad en el carrito
            botonMenos.addEventListener("click", () => {
                this.borrarProducto(producto.id, productos);
                this.actualizarTotal();
                this.mostrar(this.carrito, productos);
            });

            // Evento para aumentar la cantidad en el carrito
            botonMas.addEventListener("click", () => {           
                this.anadirProducto(producto.id, productos, itemCarrito?.cantidad+1);
                this.actualizarTotal();
                this.mostrar(this.carrito, productos);
            });

            containerDiv.appendChild(divProducto);
            liastadoCarrito.appendChild(containerDiv);
        });
    }

    // Función para reducir la cantidad de un producto en el carrito. Si la cantidad llega a 0, se elimina el producto.
    borrarProducto(idProducto, productos) {
        const productoCarrito = this.carrito.find(item => item.id === idProducto);
        const productoListado = productos.find(item => item.id === idProducto);
        const nuevaCantidad = productoCarrito.cantidad -= 1;
        
        if (nuevaCantidad >= 0) {
            productoCarrito.cantidad = nuevaCantidad;
            productoCarrito.stock += 1;
            productoListado.actualizarStock(productoListado.stock + 1);

            if (nuevaCantidad === 0) {
                this.carrito = this.carrito.filter(x => x.id !== idProducto);
                productoListado.stock = productoCarrito.stockInicial;
            }
           if(nuevaCantidad==0){
            alert("Producto retirado del carrito");
           }else{
            alert(`Cantidad del producto actualizada en el carrito. Nueva cantidad: ${nuevaCantidad}`);
           }
        }
    }

    // Cambia la cantidad de un producto en el carrito. Si la cantidad es 0, el producto se elimina del carrito.
    cambiarCantidadProducto(idProducto, productos, nuevaCantidad) {
        const productoCarrito = this.carrito.find(item => item.id === idProducto);
        const productoListado = productos.find(item => item.id === idProducto);

        // Verifica si el producto existe en la lista de productos
        if (!productoListado) {
            alert("Producto no encontrado en su carrito");
            return;
        }

        // Verifica si la nueva cantidad es válida y no excede el stock total disponible
        const stockDisponible = productoListado.stock + (productoCarrito ? productoCarrito.cantidad : 0);

        if (nuevaCantidad < 0) {
            alert("La cantidad no puede ser negativa");
            return; // No se permite cantidad negativa
        }

        if (nuevaCantidad === 0) {
            // Si el usuario quiere eliminar el producto del carrito
            if (productoCarrito) {
                this.carrito = this.carrito.filter(x => x.id !== idProducto);
                productoListado.stock = productoCarrito.stockInicial; // Restaura el stock original
                alert("Producto retirado del carrito");

            } else {
                alert("Este producto no está en el carrito");
            }
            return;
        }

        // Verifica si la cantidad solicitada no excede el stock total disponible
        if (nuevaCantidad > stockDisponible) {
            alert(`Cantidad solicitada excede el stock disponible. Stock disponible: ${stockDisponible}.`);
            return; // Si la cantidad solicitada es mayor que el stock disponible, no se añade al carrito
        }

        if (!productoCarrito) {
            // Si el producto no está en el carrito, lo añade con la cantidad especificada
            this.carrito.push({
                ...productoListado,
                cantidad: nuevaCantidad,
                stockInicial: productoListado.stock, // Almacena el stock inicial en el carrito
                stock: productoListado.stock - nuevaCantidad // Actualiza el stock del producto en el carrito
            });
            productoListado.stock -= nuevaCantidad; // Reduce el stock del producto original

            alert(`Producto "${productoListado.nombre}" añadido al carrito con la cantidad de ${nuevaCantidad}.`);
        } else {
            // Si el producto ya está en el carrito, actualiza la cantidad y el stock
            const cantidadAnterior = productoCarrito.cantidad; // Guarda la cantidad anterior
            productoCarrito.cantidad = nuevaCantidad; // Actualiza la nueva cantidad
            productoCarrito.stock += cantidadAnterior - nuevaCantidad; // Actualiza el stock en el carrito

            // Ajusta el stock del producto original
            productoListado.stock += cantidadAnterior - nuevaCantidad;
            alert(`Cantidad del producto "${productoListado.nombre}" actualizada en el carrito. Nueva cantidad: ${nuevaCantidad}.`);
        }
    }

    // Función para añadir un producto al carrito, si no existe ya, con una cantidad definida.
    anadirProducto(idProducto, productos, nuevaCantidad = 0) {
        const productoCarrito = this.carrito.find(item => item.id === idProducto);
        const productoListado = productos.find(item => item.id === idProducto);
    
        if (!productoListado) {
            alert("Producto no encontrado");
            return;
        }
    
        // Si nuevaCantidad no está definida, se incrementa en 1
        if (nuevaCantidad === 0) {
            nuevaCantidad = 1;
        }
    
        // Verifica si la cantidad es válida
        if (nuevaCantidad <= 0) {
            alert("La cantidad debe ser mayor que 0");
            return;
        }
    
        // Verifica el stock disponible
        const stockDisponible = productoListado.stock + (productoCarrito ? productoCarrito.cantidad : 0);
        if (nuevaCantidad > stockDisponible) {
            alert(`Cantidad solicitada excede el stock disponible. Stock disponible: ${stockDisponible}`);
            return;
        }
    
        if (!productoCarrito) {
            // Si el producto no está en el carrito, lo añadimos con la cantidad especificada
            if (productoListado.stock >= nuevaCantidad) {
                this.carrito.push({
                    ...productoListado,
                    cantidad: nuevaCantidad,
                    stockInicial: productoListado.stock,
                    stock: productoListado.stock - nuevaCantidad
                });
                productoListado.stock -= nuevaCantidad;
                alert(`Producto "${productoListado.nombre}" añadido al carrito con cantidad ${nuevaCantidad}`);
            } else {
                alert("No hay suficiente stock para añadir esta cantidad.");
            }
        } else {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            const cantidadAnterior = productoCarrito.cantidad;
            if (nuevaCantidad === 0) {
                // Elimina el producto del carrito
                this.carrito = this.carrito.filter(item => item.id !== idProducto);
                productoListado.stock += cantidadAnterior;  // Restaura el stock del producto listado
                alert("Producto retirado del carrito.");
            } else {
                // Actualiza la cantidad
                if (nuevaCantidad > cantidadAnterior) {
                    const stockNecesario = nuevaCantidad - cantidadAnterior;
                    if (productoListado.stock >= stockNecesario) {
                        productoCarrito.cantidad = nuevaCantidad;
                        productoCarrito.stock += cantidadAnterior - nuevaCantidad;
                        productoListado.stock -= stockNecesario;
                        alert(`Cantidad del producto actualizada en el carrito. Nueva cantidad: ${nuevaCantidad}`);
                    } else {
                        alert(`No hay suficiente stock. Solo hay ${productoListado.stock} unidades disponibles.`);
                        return;
                    }
                } else {
                    productoCarrito.cantidad = nuevaCantidad;
                    productoListado.stock += cantidadAnterior - nuevaCantidad;
                    alert(`Cantidad del producto actualizada en el carrito. Nueva cantidad: ${nuevaCantidad}`);
                }
            }
        }
    }

    // Busca un producto en el carrito por nombre
    buscarProducto(term) {
        const filteredProducts = this.carrito.filter(producto =>
            producto.nombre.toLowerCase().includes(term.toLowerCase())
        );
    
        if (filteredProducts.length === 0) {
            alert('¡Ningún producto encontrado!');   
        } else {
            const productosEncontrados = filteredProducts.map(producto => producto.nombre).join(', ');
            alert(`Productos encontrados: ${productosEncontrados}`);
        }
    
        return filteredProducts;
    }

    // Actualiza el total del carrito y lo muestra en la interfaz
    actualizarTotal() {
        const total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        // Actualiza la div que muestra el total
        const cartTotalElement = document.getElementById("cart-total");
        cartTotalElement.textContent = `Total a pagar: R$ ${total.toFixed(2)}`;
    }
}

export default Carrito;
