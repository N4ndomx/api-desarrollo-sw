import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredienteDto } from './create-ingrediente.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';

export class UpdateIngredienteDto extends PartialType(CreateIngredienteDto) {
    @IsOptional()
    @IsNumber()
    agregar_stock?: number

    @IsOptional()
    @IsEnum(Estados_Entidades)
    estado?: Estados_Entidades
}
