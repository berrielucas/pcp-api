import { IsNotEmpty, IsString } from "class-validator";

export class CreateRawMaterialDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly unit: string;
}
