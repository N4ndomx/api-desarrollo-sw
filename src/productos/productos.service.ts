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
          return { Ingrediente: ingrediente, cantidad: ing.cantidad_usada };
        }));

        const productoPreparado = new ProductoPreparado(data.nombre, data.descripcion, data.precio, ingredientesReceta);
        const producto = await this.productoRepository.save(ProductoPreparadoMapper.toSchema(productoPreparado));

        await Promise.all(ingredientesReceta.map(async (ingtoP) => {
          const db = this.productoIngredienteRepository.create({
            cantidad: ingtoP.cantidad,
            ingrediente: ingtoP.Ingrediente,
            producto: producto
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
    const inventarios = await this.inventarioRepository.find()
    const mapdata = inventarios.map((inv) => {
      const { producto, ...data } = inv
      return {
        ...producto,
        ...data
      }
    })

    return mapdata
  }
  async findAllProductosPreparados() {


    const productosPreparados = await this.productoIngredienteRepository.find()
    // Mapa para almacenar productos únicos
    const productosUnicos = new Map<string, ProductoPreparado>();

    // Procesar los resultados para obtener una lista de productos únicos con sus ingredientes
    productosPreparados.forEach((productoPreparado) => {
      const dbp = productoPreparado.producto
      const productoId = dbp.id_producto;

      // Si el producto no está en el mapa, agregarlo con sus ingredientes
      if (!productosUnicos.has(productoId)) {
        const producto = new ProductoPreparado(
          dbp.nombre,
          dbp.descripcion,
          dbp.precio,
          []
        )
        productosUnicos.set(productoId, producto);
      }

      // Obtener el producto del mapa y agregar el ingrediente
      const producto = productosUnicos.get(productoId);
      producto.ingredientes.push({
        Ingrediente: productoPreparado.ingrediente,
        cantidad: productoPreparado.cantidad,
      });

      // Actualizar el producto en el mapa
      productosUnicos.set(productoId, producto);
    });

    // Convertir los valores del mapa a un array
    const productosArray = Array.from(productosUnicos.values());

    return productosArray;
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
