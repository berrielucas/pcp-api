import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly password?: string;

    @IsString()
    @IsEnum({
        admin: 'admin',
        operator: 'operator'
    })
    @IsNotEmpty()
    @IsOptional()
    readonly role?: 'admin' | 'operador';
}
