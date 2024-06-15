import { IsString } from "class-validator";

export class CreateCuentaDto {
    @IsString()
    nombre_titular: string
}
