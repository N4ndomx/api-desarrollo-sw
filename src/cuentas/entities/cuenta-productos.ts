import { Producto } from "src/productos/entities/producto.entity"
import { Cuenta } from "./cuenta.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ProductoSchema } from "src/productos/entities/schemas/producto.schema"
@Entity()
export class Cuenta_Producto {
    @PrimaryGeneratedColumn('uuid')
    id_cuenta_prod: string
    @ManyToOne(() => Cuenta)
    cuenta: Cuenta
    @ManyToOne(() => ProductoSchema, { eager: true })
    product: ProductoSchema
    @Column('int')
    cantidad: number
    @CreateDateColumn()
    fecha_registro: string
}