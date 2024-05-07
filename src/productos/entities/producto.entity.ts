import { Estados_Entidades } from "src/shared/helpers/estado-producto.enum";


export class Producto {
    nombre: string;
    descripcion: string;
    SKU: string
    precio: number;
    stock: number;
    create_at: Date;
    modified_at: Date;
    estado: Estados_Entidades;

    constructor(nombre: string, descripcion: string, precio: number, cantidadDisponible: number = Infinity, SKU?: string) {
        this.nombre = nombre;
        this.descripcion = descripcion
        this.precio = precio;
        this.stock = cantidadDisponible;
        this.SKU = SKU ?? this.generarSKU(nombre)
        this.estado = Estados_Entidades.ACTIVO


    }

    // Método para restar la cantidad vendida del stock
    vender(cantidad: number): void {
        if (cantidad <= this.stock) {
            this.stock -= cantidad;
            console.log(`Se vendieron ${cantidad} unidades de ${this.nombre}`);
        } else {
            throw new Error(`No hay suficientes unidades de ${this.nombre} en stock`);
        }
    }
    generarSKU(nombre: string): string {
        const nombreSinEspacios = nombre.toLowerCase().replace(/\s/g, '');
        const identificadorUnico = new Date().getMilliseconds()
        const sku = nombreSinEspacios.substring(0, 6) + '-' + identificadorUnico;
        return sku.toUpperCase();
    }


}