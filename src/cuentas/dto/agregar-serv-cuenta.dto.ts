import { ArrayUnique, IsArray, IsUUID } from "class-validator";

export class AgregarServiciosDTO {
    @IsArray()
    @IsUUID('all', { each: true, message: 'Cada id debe ser un UUID válido' })
    servicios: string[];

    @IsUUID('all', { message: 'La cuenta debe ser un UUID válido' })
    cuenta: string;
}
