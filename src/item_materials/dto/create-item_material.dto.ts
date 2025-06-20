import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Item } from "src/items/entities/item.entity";

export class CreateItemMaterialDto {
    @IsNotEmpty()
    readonly item: Item;

    @IsNotEmpty()
    readonly raw_material: Item;
    
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    readonly quantity: number;
}
