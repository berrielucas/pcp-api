import { Module } from '@nestjs/common';
import { ProductionPerformanceService } from './production_performance.service';
import { ProductionPerformanceController } from './production_performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionPerformance } from './entities/production_performance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionPerformance]),
  ],
  controllers: [ProductionPerformanceController],
  providers: [ProductionPerformanceService],
  exports: [ProductionPerformanceService],
})
export class ProductionPerformanceModule {}
