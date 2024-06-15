import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { isTypedArray } from "util/types";

export class CreateProductoDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    SKU?: string;

    @IsNotEmpty()
    @IsNumber()
    precio: number;

    @IsOptional()
    @IsNumber()
    stock?: number;
    @IsOptional()
    @IsNumber()
    stock_min?: number;
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => IngredienteReceta)
    receta?: IngredienteReceta[]

}
class IngredienteReceta {
    @IsUUID("all")
    id_ingrediente: string

    @IsNumber()
    cantidad_usada: number
}