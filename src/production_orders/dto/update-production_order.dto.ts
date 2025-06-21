import { PartialType } from '@nestjs/swagger';
import { CreateProductionOrderDto } from './create-production_order.dto';

export class UpdateProductionOrderDto extends PartialType(CreateProductionOrderDto) {}
