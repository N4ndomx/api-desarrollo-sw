import { ProductoIngredienteSchema } from 'src/productos/entities/schemas/prodcuto-ingredientes.schema';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';
import { UnidadMedida } from 'src/shared/helpers/unidad-medida.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Ingrediente {
    @PrimaryGeneratedColumn('uuid')
    id_ingrediente: string;

    @Column()
    nombre: string;

    @Column('enum', { enum: UnidadMedida })
    unidad_medida: UnidadMedida;

    @Column('enum', { enum: Estados_Entidades, default: Estados_Entidades.ACTIVO })
    estado: Estados_Entidades

    @Column('int')
    stock: number;

    @Column('int')
    stock_min: number;

    @Column('int')
    stock_maximo: number;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    modified_at: Date;


    @OneToMany(() => ProductoIngredienteSchema, productoIngrediente => productoIngrediente.ingrediente)
    productos: ProductoIngredienteSchema[];

}
