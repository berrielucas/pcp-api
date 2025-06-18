import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { Item } from "src/items/entities/item.entity";

export class CreateInventoryDto {
    @IsNotEmpty()
    readonly item: Item;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    readonly quantity: number;
}
