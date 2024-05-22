import { Estados_Entidades } from "src/shared/helpers/estado-producto.enum";
import { ProductoInventarioShema } from "../entities/schemas/producto-inventario.shema";

export class ResponseProductoDTO {

    id_producto: string
    nombre: string;
    descripcion: string;
    SKU: string
    estado: Estados_Entidades
    precio: number;
    create_at: Date;
    modified_at: Date;
    stock: number
    stock_min: number
    modified_inven: Date

    static bdtoResponse(db: ProductoInventarioShema): ResponseProductoDTO {
        const res = new ResponseProductoDTO()

        const p = db.producto
        res.nombre = p.nombre
        res.descripcion = p.descripcion
        res.id_producto = p.id_producto
        res.estado = p.estado
        res.SKU = p.SKU
        res.precio = p.precio
        res.stock = db.stock
        res.stock_min = db.stock_min
        res.create_at = p.create_at
        res.modified_at = p.modified_at
        res.modified_inven = p.modified_at
        return res
    }
}