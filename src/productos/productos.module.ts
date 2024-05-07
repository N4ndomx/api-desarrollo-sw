import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoSchema } from './entities/schemas/producto.schema';
import { ProductoIngredienteSchema } from './entities/schemas/prodcuto-ingredientes.schema';
import { ProductosService } from './productos.service';
import { IngredientesModule } from 'src/ingredientes/ingredientes.module';

@Module({
  imports: [IngredientesModule, TypeOrmModule.forFeature([ProductoSchema, ProductoIngredienteSchema])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }
