import { PartialType } from '@nestjs/swagger';
import { CreateProductionOrderDto } from './create-production_order.dto';
import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class UpdateProductionOrderDto extends PartialType(CreateProductionOrderDto) {
    @ValidateIf(o => o.status === 'finished')
    @IsNumber()
    @IsNotEmpty()
    readonly approved_quantity?: number;
}
