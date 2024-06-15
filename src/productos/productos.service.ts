import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IngredientesService } from 'src/ingredientes/ingredientes.service';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';
import { handleDBexceptions } from 'src/shared/helpers/handleDBexception.method';
import { ProductoSchema } from './entities/schemas/producto.schema';
import { Producto } from './entities/producto.entity';
import { IngredientesReceta, ProductoPreparado } from './entities/producto-preparado.entity';
import { ProductoPreparadoMapper } from './producto.mapper';
import { ProductoIngredienteSchema } from './entities/schemas/prodcuto-ingredientes.schema';
import { ProductoInventarioShema } from './entities/schemas/producto-inventario.shema';
import { ResponceUserDto } from 'src/usuarios/dto/responce-user.dto';
import { ResponseProductoDTO } from './dto/response-producto.dto';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');
  constructor(
    @InjectRepository(ProductoSchema)
    private productoRepository: Repository<ProductoSchema>,
    @InjectRepository(ProductoIngredienteSchema)
    private productoIngredienteRepository: Repository<ProductoIngredienteSchema>,
    @InjectRepository(ProductoInventarioShema)
    private inventarioRepository: Repository<ProductoInventarioShema>,
    private ingredienteService: IngredientesService,
    private readonly dataSourse: DataSource

  ) { }
  async create(createProductoDto: CreateProductoDto) {
    const { receta, stock = 0, stock_min = 0, SKU, ...data } = createProductoDto;

    try {
      if (receta) {
        const ingredientesReceta: IngredientesReceta[] = await Promise.all(receta.map(async (ing) => {
          const ingrediente = await this.ingredienteService.findOne(ing.id_ingrediente);
          return { ingrediente: ingrediente, cantidad: ing.cantidad_usada };
        }));

        const productoPreparado = new ProductoPreparado(data.nombre, data.descripcion, data.precio, ingredientesReceta);
        const producto = await this.productoRepository.save(ProductoPreparadoMapper.toSchema(productoPreparado));
        productoPreparado.id_producto = producto.id_producto

        await Promise.all(ingredientesReceta.map(async (ingtoP) => {
          const db = this.productoIngredienteRepository.create({
            cantidad: ingtoP.cantidad,
            ingrediente: ingtoP.ingrediente,
            producto: { id_producto: producto.id_producto }
          });

          await this.productoIngredienteRepository.save(db);
        }));

        return productoPreparado;
      } else {
        const productoSave = await this.productoRepository.save(new Producto(data.nombre, data.descripcion, data.precio, SKU));
        const inventarioModl = this.inventarioRepository.create({
          stock: stock,
          stock_min: stock_min,
          producto: productoSave
        })
        const { producto, ...inve } = await this.inventarioRepository.save(inventarioModl)
        return {
          ...producto,
          ...inve
        };
      }
    } catch (error) {
      handleDBexceptions(error, this.logger);
    }
  }

  async findAllProductos() {

    const query = await this.productoRepository.find({
      loadEagerRelations: false,
      join: {
        alias: "producto",
        innerJoinAndSelect: {
          ProductoInventario: "producto.inventario",
        },

      },
    })

    return query
  }
  async findAllProductosPreparados() {

    const query = await this.productoRepository.find({
      join: {
        alias: "producto",
        innerJoinAndSelect: {
          productoIngredientes: "producto.receta",
        },
      },
    })
    return query
  }

  async findOneProducto(id: string) {
    const query = await this.productoRepository.findOne({
      loadEagerRelations: false,
      join: {
        alias: "producto",
        innerJoinAndSelect: {
          ProductoInventario: "producto.inventario",
        },

      },
      where: {
        id_producto: id
      }
    })

    return query
  }

  async findOneProductoPreparado(id: string) {
    const query = await this.productoRepository.findOne({
      join: {
        alias: "producto",
        innerJoinAndSelect: {
          productoIngredientes: "producto.receta",
        },
      },
      where: {
        id_producto: id
      }
    })

    return query
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const { receta, stock, stock_min, ...data } = updateProductoDto;
    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const producto = await this.productoRepository.preload({
        id_producto: id,
        ...data,
      });

      if (!producto) {
        throw new Error(`Producto no encontrado`);
      }

      if (receta) {
        await queryRunner.manager.delete(ProductoIngredienteSchema, { producto: { id_producto: id } });

        for (const tar of receta) {
          const ing = await this.ingredienteService.findOne(tar.id_ingrediente);
          const productoIngrediente = queryRunner.manager.create(ProductoIngredienteSchema, {
            cantidad: tar.cantidad_usada,
            ingrediente: ing,
            producto: producto
          });
          await queryRunner.manager.save(productoIngrediente);
        }

        console.log("actualizo producto prepa");
      } else {
        const inventarioProducto = await queryRunner.manager.findOneBy(ProductoInventarioShema, {
          producto: { id_producto: id }
        })
        inventarioProducto.stock = stock ? stock : inventarioProducto.stock
        inventarioProducto.stock_min = stock_min ? stock_min : inventarioProducto.stock_min
        await queryRunner.manager.save(inventarioProducto);
      }

      await queryRunner.manager.save(producto);
      await queryRunner.commitTransaction();
      console.log("Producto actualizado correctamente");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    return await this.update(id, { estado: Estados_Entidades.INACTIVO })
  }
}
