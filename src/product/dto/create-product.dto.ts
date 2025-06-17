import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly description: string;
}
