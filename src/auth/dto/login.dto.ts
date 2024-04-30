import { IsEmail, IsString, isString } from "class-validator"

export class LoginUserDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}
