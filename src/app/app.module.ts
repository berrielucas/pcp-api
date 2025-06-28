import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ItemsModule } from 'src/items/items.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { MachinesModule } from 'src/machines/machines.module';
import { ItemMaterialsModule } from 'src/item_materials/item_materials.module';
import { AlertsModule } from 'src/alerts/alerts.module';
import { ProductionOrdersModule } from 'src/production_orders/production_orders.module';
import { ProductionPerformanceModule } from 'src/production_performance/production_performance.module';
import { ProductionScheduleModule } from 'src/production_schedule/production_schedule.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'pcp',
      password: 'postgres',
      autoLoadEntities: true, // Carrega todas as entidades
      synchronize: true, // Sincroniza tudo com o BD - Não usar em produção
    }),
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => ItemMaterialsModule),
    forwardRef(() => MachinesModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => ProductionOrdersModule),
    forwardRef(() => ProductionPerformanceModule),
    forwardRef(() => ProductionScheduleModule),
    forwardRef(() => AuthModule),
  ],
})
export class AppModule {}
