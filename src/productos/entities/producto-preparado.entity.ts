import { Ingrediente } from "src/ingredientes/entities/ingrediente.entity";
import { Producto } from "./producto.entity";
export interface IngredientesReceta {
    ingrediente: Ingrediente
    cantidad: number
}
export class ProductoPreparado extends Producto {
    receta: IngredientesReceta[]; // Mapa de ingredientes y su cantidad necesaria

    constructor(nombre: string, descripcion: string, precio: number, ingredientes: IngredientesReceta[], id?: string, SKU?: string) {
        super(nombre, descripcion, precio, SKU, id);
        this.receta = ingredientes;
    }


    // Método para preparar un cierto número de unidades del producto preparado
    preparar(cantidad: number): boolean {

        let puedo: boolean = true
        let preparados = 1
        for (; preparados <= cantidad && puedo; preparados++) {
            this.receta.forEach(
                (ingRst) => {
                    if (ingRst.ingrediente.stock < ingRst.cantidad) {
                        puedo = false
                    } else {
                        ingRst.ingrediente.stock = ingRst.ingrediente.stock - ingRst.cantidad
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