 class Producto {
  

    constructor(obj) {
        this.id = obj.id;
        this.nombre = obj.nombre;
        this.precio = obj.precio;
        this.stock = obj.stock;
    }



    mostrarDetalles() {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Precio: $${this.precio}, Stock: ${this.stock}`;
    }
    actualizarStock(stock){
        this.stock=stock
    }
    
}

export default Producto