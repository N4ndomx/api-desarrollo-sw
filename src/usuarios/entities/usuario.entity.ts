import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { Rol } from './rol.entity';
import { GENERO } from 'src/shared/enums/genero.enum';
import { hash } from 'bcrypt';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id_usuario: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    direccion: string;

    @Column({
        type: 'enum',
        enum: GENERO
    })
    genero: string;

    @Column()
    telefono: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Rol, rol => rol.usuarios, { eager: true })
    id_rol: Rol;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
