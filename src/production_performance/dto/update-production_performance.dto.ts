import { PartialType } from '@nestjs/swagger';
import { CreateProductionPerformanceDto } from './create-production_performance.dto';

export class UpdateProductionPerformanceDto extends PartialType(CreateProductionPerformanceDto) {}
