import { Estados_Entidades } from "src/shared/helpers/estado-producto.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductoIngredienteSchema } from "./prodcuto-ingredientes.schema";
@Entity('producto')
export class ProductoSchema {
    @PrimaryGeneratedColumn('uuid')
    id_producto: string;

    @Column('varchar')
    nombre: string;

    @Column('varchar')
    descripcion: string;

    @Column('varchar', { unique: true, })
    SKU?: string;

    @Column('money')
    precio: number;

    @Column('float')
    stock: number;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    modified_at: Date;

    @Column('enum', { enum: Estados_Entidades, default: Estados_Entidades.ACTIVO })
    estado?: Estados_Entidades;

    @OneToMany(() => ProductoIngredienteSchema, productoIngrediente => productoIngrediente.producto)
    ingredientes?: ProductoIngredienteSchema[];


}
