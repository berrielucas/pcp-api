import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductionOrdersService } from './production_orders.service';
import { CreateProductionOrderDto } from './dto/create-production_order.dto';
import { UpdateProductionOrderDto } from './dto/update-production_order.dto';
import { ProductionScheduleService } from 'src/production_schedule/production_schedule.service';
import { CreateProductionScheduleDto } from 'src/production_schedule/dto/create-production_schedule.dto';
import { UpdateProductionScheduleDto } from 'src/production_schedule/dto/update-production_schedule.dto';

@Controller('production-orders')
export class ProductionOrdersController {
  constructor(
    private readonly productionOrdersService: ProductionOrdersService,
    private readonly productionScheduleService: ProductionScheduleService,
  ) {}

  @Post()
  create(@Body() createProductionOrderDto: CreateProductionOrderDto) {
    return this.productionOrdersService.create(createProductionOrderDto);
  }

  @Get()
  findAll() {
    return this.productionOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionOrdersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductionOrderDto: UpdateProductionOrderDto) {
    return this.productionOrdersService.update(id, updateProductionOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionOrdersService.remove(id);
  }

  @Post(':id/production-schedule')
  createSchedule(
    @Param('id', ParseIntPipe) productionOrderId: number,
    @Body() createProductionScheduleDto: CreateProductionScheduleDto
  ) {
    return this.productionOrdersService.createSchedule(productionOrderId, createProductionScheduleDto);
  }

  @Get(':id/production-schedule')
  findAllSchedules(@Param('id', ParseIntPipe) productionOrderId: number) {
    return this.productionOrdersService.findAllSchedules(productionOrderId);
  }

  @Get(':id/production-schedule/:scheduleId')
  findOneSchedule(
    @Param('id', ParseIntPipe) productionOrderId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number
  ) {
    return this.productionOrdersService.findOneSchedule(productionOrderId, scheduleId);
  }

  @Patch(':id/production-schedule/:scheduleId')
  updateSchedule(
    @Param('id', ParseIntPipe) productionOrderId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() updateProductionScheduleDto: UpdateProductionScheduleDto
  ) {
    return this.productionOrdersService.updateSchedule(productionOrderId, scheduleId, updateProductionScheduleDto);
  }

  @Delete(':id/production-schedule/:scheduleId')
  removeSchedule(
    @Param('id', ParseIntPipe) productionOrderId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number
  ) {
    return this.productionOrdersService.removeSchedule(productionOrderId, scheduleId);
  }
}
