import { Ingrediente } from "src/ingredientes/entities/ingrediente.entity";
import { Producto } from "./producto.entity";
export interface IngredientesReceta {
    Ingrediente: Ingrediente
    cantidad: number
}
export class ProductoPreparado extends Producto {
    ingredientes: IngredientesReceta[]; // Mapa de ingredientes y su cantidad necesaria

    constructor(nombre: string, descripcion: string, precio: number, ingredientes: IngredientesReceta[],) {
        super(nombre, descripcion, precio);
        this.ingredientes = ingredientes;
    }


    // Método para preparar un cierto número de unidades del producto preparado
    preparar(cantidad: number): boolean {

        let puedo: boolean = true
        let preparados = 1
        for (; preparados <= cantidad && puedo; preparados++) {
            this.ingredientes.forEach(
                (ingRst) => {
                    if (ingRst.Ingrediente.stock < ingRst.cantidad) {
                        puedo = false
                    } else {
                        ingRst.Ingrediente.stock = ingRst.Ingrediente.stock - ingRst.cantidad
                    }
                }
            )
        }

        if (puedo) {
            console.log(`Se prepararon ${cantidad} unidades de ${this.nombre}`);
            return true
        } else {
            throw new Error(`No hay suficientes ingredinete para hacer ${this.nombre} `);
        }
    }


}