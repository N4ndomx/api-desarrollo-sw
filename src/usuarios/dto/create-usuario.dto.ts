import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { GENERO } from "src/shared/enums/genero.enum";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsEnum(GENERO)
    @IsNotEmpty()
    genero: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNumber()
    id_rol: number;
}
