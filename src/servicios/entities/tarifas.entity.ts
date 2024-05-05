import { UnidadFacturacion } from "src/shared/helpers/unidad-facturacion.enum";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./servicio.entity";
@Entity()
export class Tarifa {
    @PrimaryGeneratedColumn('uuid')
    id_tarifa: string;

    @Column('money')
    precio_base: number;

    @Column({ type: 'enum', enum: UnidadFacturacion })
    unidad_facturacion: UnidadFacturacion;

    @ManyToOne(() => Servicio, (model) => model.tarifas, {
        onDelete: "CASCADE"   // indico que quiero que suceda cuando se elimina una tarifa
    })
    servicio: Servicio



}