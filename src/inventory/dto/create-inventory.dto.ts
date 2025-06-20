import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, Min } from "class-validator";
import { Item } from "src/items/entities/item.entity";

export class CreateInventoryDto {
    @IsObject()
    @IsNotEmpty()
    @Type(() => Item)
    readonly item: Item;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    readonly quantity: number;
}
