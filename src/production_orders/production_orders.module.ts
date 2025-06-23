import { forwardRef, Module } from '@nestjs/common';
import { ProductionOrdersService } from './production_orders.service';
import { ProductionOrdersController } from './production_orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production_order.entity';
import { UserModule } from 'src/user/user.module';
import { ItemsModule } from 'src/items/items.module';
import { AlertsModule } from 'src/alerts/alerts.module';
import { ProductionPerformanceModule } from 'src/production_performance/production_performance.module';
import { ProductionScheduleModule } from 'src/production_schedule/production_schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionOrder]),
    forwardRef(() => UserModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => ProductionPerformanceModule),
    forwardRef(() => ProductionScheduleModule),
  ],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
