import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ProductosModule } from './productos/productos.module';
import { IngredientesModule } from './ingredientes/ingredientes.module';


@Module({
  imports: [
    ConfigModule.forRoot({

      isGlobal: true,
    }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    UsuariosModule,
    AuthModule,
    ServiciosModule,
    ProductosModule,
    IngredientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
