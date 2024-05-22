import { Module } from '@nestjs/common';
import { IngredientesController } from './ingredientes.controller';
import { IngredientesService } from './ingredientes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingrediente } from './entities/ingrediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingrediente])],
  controllers: [IngredientesController],
  providers: [IngredientesService],
  exports: [IngredientesService]
})
export class IngredientesModule { }
