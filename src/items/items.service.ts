import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';
import { ItemMaterialsService } from 'src/item_materials/item_materials.service';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly inventoryService: InventoryService,
    private readonly itemMaterialService: ItemMaterialsService,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException("Item não encontrado")
  }

  async create(createItemDto: CreateItemDto) {
    const { raw_materials, quantity, ...partialCreateItemDto } = createItemDto;

    const raw_materials_items: { raw_material: Item; quantity: number; }[] = [];

    if (raw_materials) {
      for (const element of raw_materials) {
        const raw_material = await this.findOne(element.raw_material_id);
        if (raw_material) {
          if (raw_material.item_type === 'product') {
            throw new BadRequestException("Item do tipo 'product' não pode ser usado como matéria-prima")
          }
          raw_materials_items.push({
            raw_material,
            quantity: element.quantity,
          });
        }
      }
    }

    const item = this.itemRepository.create(partialCreateItemDto);
    await this.itemRepository.save(item);

    await this.inventoryService.create({ item, quantity: quantity ?? 0 });

    for (const { raw_material, quantity } of raw_materials_items) {
      await this.itemMaterialService.create({ item, raw_material, quantity: quantity });
    }

    return this.findOne(item.id);
  }

  async findAll() {
    const items = await this.itemRepository.find({
      relations: ['inventory', 'raw_materials', 'raw_materials.raw_material'],
      select: {
        inventory: {
          quantity: true,
          updatedAt: true,
        },
        raw_materials: {
          raw_material: {
            id: true,
            name: true,
            unit: true,
          },
          quantity: true,
        },
      },
      order: {
        id: 'ASC'
      }
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemRepository.find({
      where: {
        id,
      },
      relations: ['inventory', 'raw_materials', 'raw_materials.raw_material'],
      select: {
        inventory: {
          quantity: true,
          updatedAt: true,
        },
        raw_materials: {
          raw_material: {
            id: true,
            name: true,
            unit: true,
          },
          quantity: true,
        },
      },
    });
    if (item?.length) return item[0];
    this.throwNotFoundError();
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const { raw_materials, quantity, ...partialUpdateItemDto } = updateItemDto;

    const item = await this.findOne(id);

    const raw_materials_items: { raw_material: Item; quantity: number; }[] = [];

    if (raw_materials?.length) {
      for (const element of raw_materials) {
        const raw_material = await this.findOne(element.raw_material_id);
        if (raw_material) {
          if (raw_material.item_type === 'product') {
            throw new BadRequestException("Item do tipo 'product' não pode ser usado como matéria-prima")
          }
          raw_materials_items.push({
            raw_material,
            quantity: element.quantity,
          });
        }
      }
    }


    if (item) {
      const update_item = await this.itemRepository.preload({
        id, 
        ...partialUpdateItemDto
      });
      if (update_item) {
        await this.itemRepository.save(update_item);
      }
      if (quantity) {
        await this.updateInventory(item.id, { quantity });
      }
      if (raw_materials !== undefined) {
        await this.itemMaterialService.deleteByItem(item);
        for (const { raw_material, quantity } of raw_materials_items) {
          await this.itemMaterialService.create({ item, raw_material, quantity });
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.itemRepository.findOneBy({ id });
    if (item) return this.itemRepository.remove(item);
    this.throwNotFoundError();
  }

  async updateInventory(id: number, updateInventoryDto: UpdateInventoryDto) {
    const item = await this.findOne(id);
    await this.inventoryService.update(id, updateInventoryDto);
    return this.findOne(id);
  }
}
