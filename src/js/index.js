import ProductoFisico from "./classes/ProductoFisico.js"; // Importa la clase Producto Físico
import ProductoDescargable from "./classes/ProductoDescargable.js"; // Importa la clase Producto Descargable
import "../styles/main.css"; // Importa el CSS necesario
import Carrito from "./classes/Carrito.js";

class Main {
    constructor() {
        this.productos = []; // Array para almacenar productos
        this.carrito = new Carrito();
        this.init(); // Llama la función de inicialización
        this.mostrarListadoProductos(); // Muestra los productos inicialmente
    }

    init() {
        this.crearProductos(); // Crea productos
        this.attachEventListeners(); // Asigna eventos de escucha
    }

    crearProductos() {
        // Lógica para crear instancias de productos y agregarlos al array de productos
        for (let i = 1; i <= 5; i++) {
            const productoFisico = new ProductoFisico({
                id: i,
                nombre: `Producto Físico ${i}`,
                precio: (10 * i).toFixed(2),
                stock: 20 + i,
                peso: (i * 1.5).toFixed(1),
            });
            this.productos.push(productoFisico);
        }

        for (let i = 6; i <= 10; i++) {
            const productoDescargable = new ProductoDescargable({
                id: i,
                nombre: `Producto Descargable ${i - 5}`,
                precio: (15 * i).toFixed(2),
                stock: 100 + i,
                tamano_archivo: (i * 200).toFixed(1),
            });
            this.productos.push(productoDescargable);
        }
    }

    mostrarProductos() {
        const selectorProducto = document.getElementById("product-selector");
        
        if (selectorProducto) {
            selectorProducto.innerHTML = '<option value="" selected>Selecciona...</option>';
            this.productos.forEach((producto) => {
                const opcion = document.createElement("option");
                opcion.value = producto.id;
                opcion.text = producto.nombre;
                selectorProducto.add(opcion);
            });
        }
    }

    esconderListado() {
        const listadoProducto = document.getElementById("product-list");
        listadoProducto.classList.add("hidden");
        listadoProducto.innerHTML = ""; 
    }
    
    mostrarCajaProducto(idProducto) {
        const listadoProducto = document.getElementById("product-list");
        listadoProducto.classList.remove("hidden"); // Muestra el contenedor de productos
        listadoProducto.innerHTML = ""; // Limpia cualquier producto mostrado anteriormente

        const producto = this.productos.find((prod) => prod.id === idProducto);
        if (!producto) return;
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container'; 
        
        const divProducto = document.createElement('div');
        divProducto.className = 'product';
        
        // Agrega el nombre del producto
        divProducto.innerHTML = `
            <div class="name"><h4>${producto.nombre}</h4></div>
        `;

        const productoOriginal = this.productos.find(x => x.id === producto.id);

        // Si el producto es descargable, agrega el tamaño del archivo antes de la cantidad en stock
        if (productoOriginal instanceof ProductoDescargable) {
            if (productoOriginal.tamano_archivo) {
                divProducto.innerHTML += `<div class="info"><h5>Tamaño del archivo: ${productoOriginal.tamano_archivo}</h5></div>`;
            }
        } else {
            if (productoOriginal.peso) {
                divProducto.innerHTML += `<div class="info"><h5>Peso: ${productoOriginal.peso} Kg</h5></div>`;
            }
        }

        // Agrega stock y precio
        divProducto.innerHTML += `
            <div class="info"><h5>Hay ${producto.stock} unidades</h5></div>
            <div class="price"><h4>R$ ${producto.precio}</h4></div>
        `;

        // Agrega el tipo de producto como última div
        if (productoOriginal instanceof ProductoDescargable) {
            divProducto.innerHTML += `<div class="type"><h4>Producto descargable</h4></div>`;
        } else {
            divProducto.innerHTML += `<div class="type"><h4>Producto físico</h4></div>`;
        }

        containerDiv.appendChild(divProducto);
        listadoProducto.appendChild(containerDiv);
    }
    
    mostrarListadoProductos() {
        document.getElementById("product-list").style.display = "flex";
        document.getElementById("search-box").style.display = "flex";
        document.getElementById("cart-list").style.display = "none";
        this.mostrarProductos();
    }

    mostrarListadoCarrito() {
        this.esconderListado(); // Oculta la lista de productos de la pantalla principal
        document.getElementById("product-list").style.display = "none";
        document.getElementById("search-box").style.display = "none";
        document.getElementById("cart-list").style.display = "block";
        
        this.carrito.mostrar(this.carrito.carrito, this.productos)
    }
    anadirProducto() {
        const selectorProducto = document.getElementById("product-selector");
        const idProducto = parseInt(selectorProducto?.value); // ID del producto seleccionado
       
        const producto = this.productos.find(prod => prod.id === idProducto);

        if (!producto) {
            alert("Por favor, seleccione un producto");
            return;
        }
        const productoCarrito = this.carrito.carrito.find(prod => prod.id === idProducto);
        
        this.carrito.anadirProducto(producto.id, this.productos, productoCarrito?.cantidad + 1 || 1);
        this.carrito.actualizarTotal();
        this.mostrarCajaProducto(idProducto);
    }

    attachEventListeners() {
        document.getElementById("view-products").addEventListener('click', () => this.mostrarListadoProductos());
        document.getElementById("view-cart").addEventListener('click', () => this.mostrarListadoCarrito());
        document.getElementById("addProduct").addEventListener('click', () => this.anadirProducto());
      
        // Captura el campo de búsqueda
        const inputBusqueda = document.getElementById("search-input");
        const botonBusqueda = document.getElementById("search-button");

        const botonLimpiar = document.getElementById("search-button-clean");
        // Evento para limpiar búsqueda
        botonLimpiar.addEventListener("click", () => {
            inputBusqueda.value = "";
            this.carrito.mostrar(this.carrito.carrito, this.productos);
        });
        
        botonBusqueda.addEventListener("click", () => {
            const textoBusqueda = inputBusqueda.value.toLowerCase();
            const productosFiltrados = this.carrito.buscarProducto(textoBusqueda);
            this.carrito.mostrar(productosFiltrados, this.productos);
        });
        
        document.getElementById("view-products").addEventListener('click', () => this.mostrarListadoProductos());
        document.getElementById("view-cart").addEventListener('click', () => this.mostrarListadoCarrito());
    
        // Evento para el selector de productos
        const selectorProducto = document.getElementById("product-selector");
        selectorProducto.addEventListener("change", (event) => {
            const idProducto = parseInt(event.target.value);
            if (!isNaN(idProducto)) { // Si es un producto válido
                this.mostrarCajaProducto(idProducto); // Muestra el producto seleccionado
            }
        });
    }

  
}

// Instancia la clase Main al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    new Main();
    const verProductos = document.getElementById('view-products');
    const verCarrito = document.getElementById('view-cart');

    // Define la página predeterminada como "Comprar"
    seccionResaltada(verProductos);

    // Agrega eventos de clic para alternar el destacado
    verProductos.addEventListener('click', () => seccionResaltada(verProductos));
    verCarrito.addEventListener('click', () => seccionResaltada(verCarrito));

    function seccionResaltada(seccionSeleccionada) {
        verProductos.classList.remove('highlighted');
        verCarrito.classList.remove('highlighted');
        seccionSeleccionada.classList.add('highlighted');
    }
});
