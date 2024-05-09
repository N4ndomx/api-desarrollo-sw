import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductoSchema } from "./producto.schema";
import { Ingrediente } from "src/ingredientes/entities/ingrediente.entity";
@Entity('producto_ingrediente')
export class ProductoIngredienteSchema {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductoSchema, producto => producto.receta,)
    @JoinColumn({ name: 'id_producto' })
    producto: ProductoSchema;

    @ManyToOne(() => Ingrediente, ingrediente => ingrediente.productos, { eager: true, cascade: false })
    @JoinColumn({ name: 'id_ingrediente' })
    ingrediente: Ingrediente;

    @Column('int')
    cantidad: number;
}