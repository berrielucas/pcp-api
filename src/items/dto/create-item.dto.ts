import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly description: string;
    
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
}
