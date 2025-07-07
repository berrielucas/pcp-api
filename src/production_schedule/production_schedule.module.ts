import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductionSchedule } from "./entities/production_schedule.entity";
import { ProductionOrdersModule } from "src/production_orders/production_orders.module";
import { MachinesModule } from "src/machines/machines.module";
import { UserModule } from "src/user/user.module";
import { forwardRef, Module } from "@nestjs/common";
import { ProductionScheduleController } from "./production_schedule.controller";
import { ProductionScheduleService } from "./production_schedule.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionSchedule]),
    forwardRef(() => ProductionOrdersModule),
    forwardRef(() => MachinesModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ProductionScheduleController],
  providers: [ProductionScheduleService],
  exports: [ProductionScheduleService],
})
export class ProductionScheduleModule {}
