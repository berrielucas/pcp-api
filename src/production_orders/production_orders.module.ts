import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production_order.entity';
import { UserModule } from 'src/user/user.module';
import { ItemsModule } from 'src/items/items.module';
import { AlertsModule } from 'src/alerts/alerts.module';
import { ProductionPerformanceModule } from 'src/production_performance/production_performance.module';
import { ProductionScheduleModule } from 'src/production_schedule/production_schedule.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ItemMaterialsModule } from 'src/item_materials/item_materials.module';
import { ProductionOrdersController } from './production_orders.controller';
import { ProductionOrdersService } from './production_orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionOrder]),
    forwardRef(() => UserModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => ProductionPerformanceModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => ItemMaterialsModule),
    forwardRef(() => ProductionScheduleModule),
  ],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
  exports: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
