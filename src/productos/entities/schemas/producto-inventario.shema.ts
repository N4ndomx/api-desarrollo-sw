import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductoSchema } from "./producto.schema";

@Entity('ProductoInventario')
export class ProductoInventarioShema {
    @PrimaryGeneratedColumn('uuid')
    id_producto_inventario: string

    @Column('int')
    stock: number;

    @Column('int')
    stock_min: number;

    @UpdateDateColumn()
    modified_inven: Date;

    @OneToOne(() => ProductoSchema, { eager: true })
    @JoinColumn()
    producto: ProductoSchema


}