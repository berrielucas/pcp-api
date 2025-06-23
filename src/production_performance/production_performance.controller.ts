import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductionPerformanceService } from './production_performance.service';
import { CreateProductionPerformanceDto } from './dto/create-production_performance.dto';
import { UpdateProductionPerformanceDto } from './dto/update-production_performance.dto';

@Controller('production-performance')
export class ProductionPerformanceController {
  constructor(private readonly productionPerformanceService: ProductionPerformanceService) {}

  @Post()
  create(@Body() createProductionPerformanceDto: CreateProductionPerformanceDto) {
    return this.productionPerformanceService.create(createProductionPerformanceDto);
  }

  @Get()
  findAll() {
    return this.productionPerformanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionPerformanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductionPerformanceDto: UpdateProductionPerformanceDto) {
    return this.productionPerformanceService.update(id, updateProductionPerformanceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionPerformanceService.remove(id);
  }
}
