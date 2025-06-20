import { IsNotEmpty, IsNumber } from "class-validator";

export class ItemMaterialDto {
    @IsNumber()
    @IsNotEmpty()
    readonly raw_material_id: number;

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number;
}