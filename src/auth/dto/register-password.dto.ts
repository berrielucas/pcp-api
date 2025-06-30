import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly confirm_password: string;
}
