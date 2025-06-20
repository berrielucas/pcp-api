import { Injectable } from '@nestjs/common';
import { CreateItemMaterialDto } from './dto/create-item_material.dto';
import { UpdateItemMaterialDto } from './dto/update-item_material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemMaterial } from './entities/item_material.entity';
import { Repository } from 'typeorm';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class ItemMaterialsService {

  constructor(
    @InjectRepository(ItemMaterial)
    private readonly itemMaterialRepository: Repository<ItemMaterial>,
  ) { }

  async create(createItemMaterialDto: CreateItemMaterialDto) {
    const item_material = this.itemMaterialRepository.create(createItemMaterialDto);
    return this.itemMaterialRepository.save(item_material);
  }

  async update(id: number, updateItemMaterialDto: UpdateItemMaterialDto) {
    const { item, raw_material, quantity } = updateItemMaterialDto;
    let item_material = await this.itemMaterialRepository.preload({
      ...updateItemMaterialDto,
    });

    if (!item_material && item && raw_material && quantity) {
      return await this.create({ item, raw_material, quantity });
    }

    if (item_material) {
      return this.itemMaterialRepository.save(item_material);
    }
  }

  async deleteByItem(item: Item) {
    await this.itemMaterialRepository.delete({ item: { id: item.id } });
  }

  remove(id: number) {
    return `This action removes a #${id} itemMaterial`;
  }
}
