import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    @IsOptional()
    @IsEnum(Estados_Entidades)
    estado?: Estados_Entidades
}
