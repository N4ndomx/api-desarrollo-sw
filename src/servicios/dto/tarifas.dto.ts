import { IsEnum, IsNumber } from "class-validator";
import { UnidadFacturacion } from "src/shared/helpers/unidad-facturacion.enum";

export class CreateTarifaDTO {
    @IsNumber({ maxDecimalPlaces: 2 })
    precio_base: number;
    @IsEnum(UnidadFacturacion)
    unidad_facturacion: UnidadFacturacion;
}