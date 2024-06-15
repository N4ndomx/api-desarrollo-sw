import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Cuenta } from "./cuenta.entity"
import { Servicio } from "src/servicios/entities/servicio.entity"

@Entity()
export class Cuenta_Servicio {
    @PrimaryGeneratedColumn('uuid')
    id_cuenta_prod: string
    @ManyToOne(() => Cuenta)
    cuenta: Cuenta
    @ManyToOne(() => Servicio, { eager: true })
    servico: Servicio
    @Column('boolean', { default: false })
    pagado: boolean
    @CreateDateColumn()
    fecha_inicio_servicio: string
}