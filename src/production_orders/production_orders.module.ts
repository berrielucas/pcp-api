import { forwardRef, Module } from '@nestjs/common';
import { ProductionOrdersService } from './production_orders.service';
import { ProductionOrdersController } from './production_orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production_order.entity';
import { UserModule } from 'src/user/user.module';
import { ItemsModule } from 'src/items/items.module';
import { AlertsModule } from 'src/alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionOrder]),
    forwardRef(() => UserModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => AlertsModule),
  ],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
