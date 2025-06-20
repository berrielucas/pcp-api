import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemMaterialsService } from './item_materials.service';
import { CreateItemMaterialDto } from './dto/create-item_material.dto';
import { UpdateItemMaterialDto } from './dto/update-item_material.dto';

@Controller('item-materials')
export class ItemMaterialsController {
  constructor(private readonly itemMaterialsService: ItemMaterialsService) {}

  @Post()
  create(@Body() createItemMaterialDto: CreateItemMaterialDto) {
    return this.itemMaterialsService.create(createItemMaterialDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemMaterialDto: UpdateItemMaterialDto) {
    return this.itemMaterialsService.update(+id, updateItemMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemMaterialsService.remove(+id);
  }
}
