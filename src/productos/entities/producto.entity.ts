import { Estados_Entidades } from "src/shared/helpers/estado-producto.enum";


export class Producto {
    nombre: string;
    descripcion: string;
    SKU: string
    precio: number;
    create_at: Date;
    modified_at: Date;
    estado: Estados_Entidades;

    constructor(nombre: string, descripcion: string, precio: number, SKU?: string) {
        this.nombre = nombre;
        this.descripcion = descripcion
        this.precio = precio;
        this.SKU = SKU ?? this.generarSKU(nombre)
        this.estado = Estados_Entidades.ACTIVO
    }


    generarSKU(nombre: string): string {
        const nombreSinEspacios = nombre.toLowerCase().replace(/\s/g, '');
        const identificadorUnico = new Date().getMilliseconds()
        const sku = nombreSinEspacios.substring(0, 6) + '-' + identificadorUnico;
        return sku.toUpperCase();
    }


}