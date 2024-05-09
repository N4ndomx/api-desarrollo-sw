import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private ingredienteService: IngredientesService
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

    const query = await this.inventarioRepository.findOneBy({ producto: { id_producto: id } })
    const res = ResponseProductoDTO.bdtoResponse(query)
    return res
  }

  async findOneProductoPreparado(id: string) {
    const query = await this.productoIngredienteRepository.findOneBy({ producto: { id_producto: id } })
    console.log(query)
  }

  update(id: string, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: string) {
    return `This action removes a #${id} producto`;
  }
}
