import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FirshLoginDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
