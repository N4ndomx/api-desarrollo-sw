import { ProductoPreparado } from "./entities/producto-preparado.entity";
import { Producto } from "./entities/producto.entity";
import { ProductoSchema } from "./entities/schemas/producto.schema";

export class ProductoPreparadoMapper {
    static toDomain(schema: ProductoSchema): Producto {
        const { nombre, descripcion, precio, SKU, modified_at, create_at } = schema;
        return new Producto(nombre, descripcion, precio,);
    }

    static toSchema(domain: ProductoPreparado): ProductoSchema {
        const sh = new ProductoSchema();
        const { nombre, descripcion, precio, SKU, create_at } = domain;
        sh.nombre = nombre
        sh.descripcion = descripcion
        sh.precio = precio
        sh.SKU = SKU
        sh.create_at = create_at
        return sh;
    }
}