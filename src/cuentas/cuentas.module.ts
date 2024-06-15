import { Module } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CuentasController } from './cuentas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { Cuenta_Producto } from './entities/cuenta-productos';
import { ProductosModule } from 'src/productos/productos.module';
import { IngredientesModule } from 'src/ingredientes/ingredientes.module';
import { Cuenta_Servicio } from './entities/cuenta-servicio';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta, Cuenta_Producto, Cuenta_Servicio]), ProductosModule, IngredientesModule],
  controllers: [CuentasController],
  providers: [CuentasService],
  exports: [CuentasService, TypeOrmModule],
})
export class CuentasModule { }
