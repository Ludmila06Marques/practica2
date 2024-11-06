import Producto from './Producto'; // Importar la clase Producto

class ProductoFisico extends Producto {
    constructor(obj) {
        super(obj);
        this.peso = obj.peso;
    }

    mostrarDetalles() {
        return `${super.mostrarDetalles()} - Peso: ${this.peso} Kg`;
    }

}
export default ProductoFisico;
