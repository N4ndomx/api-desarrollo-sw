import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifas.entity';
import { Servicio } from './entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa, Servicio])],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule { }
