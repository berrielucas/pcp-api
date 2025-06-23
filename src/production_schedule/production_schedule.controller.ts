import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductionScheduleService } from './production_schedule.service';
import { CreateProductionScheduleDto } from './dto/create-production_schedule.dto';
import { UpdateProductionScheduleDto } from './dto/update-production_schedule.dto';

@Controller('production-schedule')
export class ProductionScheduleController {
  constructor(private readonly productionScheduleService: ProductionScheduleService) {}

  @Post()
  create(@Body() createProductionScheduleDto: CreateProductionScheduleDto) {
    return this.productionScheduleService.create(createProductionScheduleDto);
  }

  @Get()
  findAll() {
    return this.productionScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionScheduleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductionScheduleDto: UpdateProductionScheduleDto) {
    return this.productionScheduleService.update(id, updateProductionScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionScheduleService.remove(id);
  }
}
