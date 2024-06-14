import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, QueryRunner } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { Cuenta_Producto } from './entities/cuenta-productos';
import { AgregarProductosDTO } from './dto/agregar-prod-cuenta.dto';
import { ProductoSchema } from 'src/productos/entities/schemas/producto.schema';
import { Estado_Cuenta } from 'src/shared/enums/estado_cuenta.enum';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';
import { ProductoPreparado } from 'src/productos/entities/producto-preparado.entity';
import { ProductoInventarioShema } from 'src/productos/entities/schemas/producto-inventario.shema';
import { ProductoInventario } from 'src/productos/entities/inventario.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { IngredientesService } from 'src/ingredientes/ingredientes.service';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { AgregarServiciosDTO } from './dto/agregar-serv-cuenta.dto';
import { Cuenta_Servicio } from './entities/cuenta-servicio';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Injectable()
export class CuentasService {
  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
    private ingredienteService: IngredientesService,
  ) { }

  async create(createCuentaDto: CreateCuentaDto) {
    const cuenta = this.cuentaRepository.create({ titular: createCuentaDto.nombre_titular });
    const res = await this.cuentaRepository.save(cuenta);
    return res;
  }

  async agregarProductos(data: AgregarProductosDTO) {
    const queryRunner = this.cuentaRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(Cuenta, {
        where: { id_cuenta: data.cuenta, estado: Estado_Cuenta.ACTIVA },
        relations: { productos: true },
      });

      if (!cuenta) {
        throw new BadRequestException('Cuenta No encontrada');
      }

      const productosCuenta = new Map(cuenta.productos.map(p => [p.product.SKU, p]));

      for (const productoDTO of data.productos) {
        const producto = await queryRunner.manager.findOne(ProductoSchema, {
          where: { SKU: productoDTO.sku, estado: Estados_Entidades.ACTIVO },
        });

        if (!producto) {
          throw new Error('Producto No encontrado');
        }

        const { receta, ...productoData } = producto;
        if (receta.length > 0) {
          const productoDominio = new ProductoPreparado(productoData.nombre, productoData.descripcion, productoData.precio, receta, productoData.id_producto, productoData.SKU);
          productoDominio.preparar(productoDTO.cantidad);

          await Promise.all(productoDominio.receta.map(async (ing) => {
            await this.ingredienteService.update(ing.ingrediente.id_ingrediente, { stock: ing.ingrediente.stock });
          }));

        } else {
          const inventario_p = await queryRunner.manager.findOne(ProductoInventarioShema, { where: { producto: { id_producto: producto.id_producto } } });
          if (!inventario_p) {
            throw new Error('Inventario no encontrado para el producto');
          }
          const produ_invem = new ProductoInventario(inventario_p.stock, inventario_p.stock_min, new Producto(producto.nombre, producto.descripcion, producto.precio, producto.SKU, producto.id_producto));
          produ_invem.vender(productoDTO.cantidad);
          inventario_p.stock = produ_invem.stock;
          await queryRunner.manager.save(ProductoInventarioShema, inventario_p);
        }

        const cuentaProducto = productosCuenta.get(producto.SKU);
        if (cuentaProducto) {
          cuentaProducto.cantidad += productoDTO.cantidad;
          await queryRunner.manager.save(Cuenta_Producto, cuentaProducto);
        } else {
          const nuevoCuentaProducto = queryRunner.manager.create(Cuenta_Producto, {
            product: producto,
            cuenta: cuenta,
            cantidad: productoDTO.cantidad,
          });
          const res = await queryRunner.manager.save(Cuenta_Producto, nuevoCuentaProducto);
          res.product.receta = undefined;
          productosCuenta.set(res.product.SKU, {
            id_cuenta_prod: res.id_cuenta_prod,
            cantidad: res.cantidad,
            fecha_registro: res.fecha_registro,
            product: res.product,
            cuenta: undefined,
          });
        }
      }

      cuenta.productos = Array.from(productosCuenta.values());

      await queryRunner.commitTransaction();
      return cuenta;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async agregarServicio(data: AgregarServiciosDTO) {
    const queryRunner = this.cuentaRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(Cuenta, {
        where: { id_cuenta: data.cuenta, estado: Estado_Cuenta.ACTIVA },
        relations: { productos: true, servicios: true },
      });

      if (!cuenta) {
        throw new Error('Cuenta No encontrada');
      }

      for (const id_ser of data.servicios) {
        const servicio = await queryRunner.manager.findOneBy(Servicio, { id_service: id_ser });
        if (!servicio) {
          throw new Error(`Servicio con id ${id_ser} no encontrado`);
        }

        const servicioExistente = cuenta.servicios.find(serv => serv.servico.id_service === id_ser);
        if (servicioExistente) {
          throw new Error(`El servicio con id ${id_ser} ya está asignado a la cuenta`);
        }

        const servicos_cuenta = new Cuenta_Servicio();
        servicos_cuenta.cuenta = cuenta;
        servicos_cuenta.servico = servicio;
        const resp_s = await queryRunner.manager.save(servicos_cuenta);
        resp_s.cuenta = undefined
        resp_s.servico.tarifas = undefined
        console.log(resp_s)
        cuenta.servicios.push(resp_s); // Agregar el nuevo servicio a la cuenta
      }

      await queryRunner.commitTransaction();
      return cuenta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }



  async findAll() {
    await this.cuentaRepository.find({ where: { estado: Estado_Cuenta.ACTIVA } })
  }

  findOne(id: number) {
    return `This action returns a #${id} cuenta`;
  }

  update(id: number, updateCuentaDto: UpdateCuentaDto) {
    return `This action updates a #${id} cuenta`;
  }

  remove(id: number) {
    return `This action removes a #${id} cuenta`;
  }
}
