import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column()
    nombre: string;

    @OneToMany(() => Usuario, usuario => usuario.id_rol)
    usuarios: Usuario[];
}
