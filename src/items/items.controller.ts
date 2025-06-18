import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { InventoryService } from 'src/inventory/inventory.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
  ) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(id);
  }

  @Patch(':id/inventory')
  updateInventory(@Param('id', ParseIntPipe) id: number, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.itemsService.updateInventory(id, updateInventoryDto);
  }
}
