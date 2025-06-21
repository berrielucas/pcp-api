import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductionOrdersService } from './production_orders.service';
import { CreateProductionOrderDto } from './dto/create-production_order.dto';
import { UpdateProductionOrderDto } from './dto/update-production_order.dto';

@Controller('production-orders')
export class ProductionOrdersController {
  constructor(private readonly productionOrdersService: ProductionOrdersService) {}

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
}
