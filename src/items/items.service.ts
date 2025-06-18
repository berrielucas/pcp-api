import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { UpdateInventoryDto } from 'src/inventory/dto/update-inventory.dto';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly inventoryService: InventoryService,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException("Item não encontrado")
  }

  async create(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create(createItemDto);
    await this.itemRepository.save(item);
    await this.inventoryService.create({ item, quantity: 0 });
    return this.findOne(item.id);
  }

  async findAll() {
    const items = await this.itemRepository.find({
      relations: ['inventory'],
      select: {
        inventory: {
          quantity: true,
          updatedAt: true,
        },
      },
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: {
        id,
      },
      relations: ['inventory'],
      select: {
        inventory: {
          quantity: true,
          updatedAt: true,
        },
      },
    });
    if (item) return item;
    this.throwNotFoundError();
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.preload({
      id,
      ...updateItemDto,
    });
    if (item) return this.itemRepository.save(item);
    this.throwNotFoundError();
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
