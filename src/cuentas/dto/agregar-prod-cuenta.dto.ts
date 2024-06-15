import { IsArray, IsUUID, ValidateNested, ArrayUnique, IsString, IsInt } from "class-validator";
import { Type } from "class-transformer";

class ProdutosDTO {
    @IsString()
    sku: string;

    @IsInt()
    cantidad: number;
}

export class AgregarProductosDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProdutosDTO)
    @ArrayUnique((producto: ProdutosDTO) => producto.sku, { message: "Cada SKU debe ser diferente" })
    productos: ProdutosDTO[];

    @IsUUID()
    cuenta: string;
}
