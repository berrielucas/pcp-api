import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
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
