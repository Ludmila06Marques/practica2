import Producto from './Producto'; 
 class ProductoDescargable extends Producto {
    constructor(obj) {
        super(obj);
        this.tamano_archivo = obj.tamano_archivo;
    }

    mostrarDetalles() {
        return `${super.mostrarDetalles()} - Tamaño del archivo: ${this.tamano_archivo} MB`;
    }

}
export default ProductoDescargable;

