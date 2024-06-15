import { IsEmail, IsNotEmpty } from "class-validator";

export class ResponceUserDto {
    @IsNotEmpty() id: string;
    @IsNotEmpty() nombre: string;
    @IsNotEmpty() apellidos: string;
    @IsNotEmpty() @IsEmail() email: string;
}
