import { Estado_Cuenta } from "src/shared/enums/estado_cuenta.enum"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Cuenta_Producto } from "./cuenta-productos"
import { Cuenta_Servicio } from "./cuenta-servicio"

@Entity()
export class Cuenta {
    @PrimaryGeneratedColumn('uuid')
    id_cuenta: string
    @Column('varchar')
    titular: string
    @Column('timestamptz', { default: "NOW()" })
    fecha_apert: string
    @Column('enum', { enum: Estado_Cuenta, default: Estado_Cuenta.ACTIVA })
    estado: Estado_Cuenta
    @OneToMany(() => Cuenta_Producto, (te) => te.cuenta)
    productos: Cuenta_Producto[]
    @OneToMany(() => Cuenta_Servicio, (te) => te.cuenta)
    servicios: Cuenta_Servicio[]
}
