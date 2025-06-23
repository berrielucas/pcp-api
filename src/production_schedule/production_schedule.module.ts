import { Module } from '@nestjs/common';
import { ProductionScheduleService } from './production_schedule.service';
import { ProductionScheduleController } from './production_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionSchedule } from './entities/production_schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionSchedule]),
  ],
  controllers: [ProductionScheduleController],
  providers: [ProductionScheduleService],
  exports: [ProductionScheduleService],
})
export class ProductionScheduleModule {}
