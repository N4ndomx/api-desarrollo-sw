import { Producto } from "./producto.entity";

export class ProductoInventario {
    id_producto_inventario: string

    stock: number;

    stock_min: number;

    stock_maximo: number;

    create_at: Date;

    modified_at: Date;

    private producto: Producto

    constructor(stock: number, stock_min: number, stock_maximo: number, producto: Producto) {
        this.stock = stock
        this.stock_min = stock_min
        this.stock_maximo = stock_maximo
        this.producto = producto
    }

    // Método para restar la cantidad vendida del stock
    vender(cantidad: number): void {
        if (cantidad <= this.stock) {
            this.stock -= cantidad;
            console.log(`Se vendieron ${cantidad} unidades de ${this.producto.nombre}`);
        } else {
            throw new Error(`No hay suficientes unidades de ${this.producto.nombre} en stock`);
        }
    }
}