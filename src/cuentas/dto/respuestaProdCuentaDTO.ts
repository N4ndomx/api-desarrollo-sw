export class ProductoDTO {
    id_producto: string;
    nombre: string;
    descripcion: string;
    SKU: string;
    precio: string;
    create_at: Date;
    modified_at: Date;
    estado: string;
}

export class RespuestaProductoCuentaDTO {
    id_cuenta_prod: string;
    cantidad: number;
    fecha_registro: Date;
    product: ProductoDTO;
}