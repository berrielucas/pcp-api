import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ItemMaterialDto } from "src/item_materials/dto/item-material.dto";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly description?: string;
    
    @IsString()
    @IsNotEmpty()
    readonly unit: string;
    
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly quantity?: number;

    @IsNumber()
    @IsOptional()
    readonly min_stock_limit?: number;
    
    @IsString()
    @IsNotEmpty()
    @IsEnum({
        product: 'product',
        raw_material: 'raw_material',
        both: 'both',
    })
    readonly item_type: 'product' | 'raw_material' | 'both';
    
    @IsArray() 
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ItemMaterialDto)
    readonly raw_materials?: ItemMaterialDto[];
}
