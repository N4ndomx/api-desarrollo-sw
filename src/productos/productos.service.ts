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

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');
  constructor(
    @InjectRepository(ProductoSchema)
    private productoRepository: Repository<ProductoSchema>,
    @InjectRepository(ProductoIngredienteSchema)
    private productoIngrediente: Repository<ProductoIngredienteSchema>,
    private ingredienteService: IngredientesService
  ) { }
  async create(createProductoDto: CreateProductoDto) {
    const { receta, stock, SKU, ...data } = createProductoDto;

    try {
      if (receta) {
        const ingredientesReceta: IngredientesReceta[] = await Promise.all(receta.map(async (ing) => {
          const ingrediente = await this.ingredienteService.findOne(ing.id_ingrediente);
          return { Ingrediente: ingrediente, cantidad: ing.cantidad_usada };
        }));

        const productoPreparado = new ProductoPreparado(data.nombre, data.descripcion, data.precio, ingredientesReceta);
        const producto = await this.productoRepository.save(ProductoPreparadoMapper.toSchema(productoPreparado));

        await Promise.all(ingredientesReceta.map(async (ingtoP) => {
          const db = this.productoIngrediente.create({
            cantidad: ingtoP.cantidad,
            ingrediente: ingtoP.Ingrediente,
            producto: producto
          });

          await this.productoIngrediente.save(db);
        }));

        return productoPreparado;
      } else {
        const producto = await this.productoRepository.save(new Producto(data.nombre, data.descripcion, data.precio, stock, SKU));
        return producto;
      }
    } catch (error) {
      handleDBexceptions(error, this.logger);
    }
  }


  async findAll() {

    const prodcutos = await this.productoRepository.find();

    const pormes = prodcutos.map(async (pro) => {

      const ing = await this.productoIngrediente.find({
        where: {
          producto: { id_producto: pro.id_producto }
        }
      })

      return {
        ...pro,
        receta: ing ?? []
      }

    })

    const productos = await Promise.all(pormes)

    // Filtrar los productos que tienen una receta definida
    const productosConReceta = productos.filter(producto => producto.receta.length > 0);

    // Mapear los productos para eliminar la propiedad `receta` de aquellos que no la tienen
    const productosSinReceta = productos.map(producto => {
      if (producto.receta.length === 0) {
        const { receta, ...productoSinReceta } = producto;
        return productoSinReceta;
      } else {
        return producto;
      }
    });

    // Combinar los productos con receta y los productos sin receta en un solo arreglo
    const productosFinal = [...productosConReceta, ...productosSinReceta];


    return productosFinal
  }

  async findOne(id: string) {
    return await this.productoRepository.findOneBy({});
  }

  update(id: string, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: string) {
    return `This action removes a #${id} producto`;
  }
}
