import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { UnidadMedida } from "src/shared/helpers/unidad-medida.enum";

export class CreateIngredienteDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsEnum(UnidadMedida)
    unidad_medida: UnidadMedida;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock_min: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock_maximo: number;
}
