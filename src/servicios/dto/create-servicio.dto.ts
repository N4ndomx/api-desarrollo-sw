import { Type } from "class-transformer";
import { CreateTarifaDTO } from "./tarifas.dto";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MinLength, Validate, ValidateNested } from "class-validator";
import { tipoFacturacionUnico } from "src/shared/validations/facturacion-unita.validator";

export class CreateServicioDto {
    @IsString()
    nombre: string
    @IsString()
    descripcion: string
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateTarifaDTO,)
    @Validate(tipoFacturacionUnico)
    tarifas: CreateTarifaDTO[]
}
