import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, ValidateNested } from "class-validator";
import { ProductionOrder } from "src/production_orders/entities/production_order.entity";

export class CreateProductionPerformanceDto {
    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ProductionOrder)
    readonly production_order: ProductionOrder;

    @IsNumber()
    @IsNotEmpty()
    readonly efficiency: number;

    @IsNumber()
    @IsNotEmpty()
    readonly productivity: number;

    @IsNumber()
    @IsNotEmpty()
    readonly quality: number;
}
