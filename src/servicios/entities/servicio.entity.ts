import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tarifa } from "./tarifas.entity";
@Entity()
export class Servicio {
    @PrimaryGeneratedColumn('uuid')
    id_service: string;

    @Column('varchar')
    nombre: string;

    @Column('varchar')
    descripcion: string;

    @OneToMany(() => Tarifa, (model) => model.servicio, { eager: true, cascade: true, })
    tarifas: Tarifa[]


}
