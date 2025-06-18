import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException("Item não encontrado")
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = this.inventoryRepository.create({
      id: createInventoryDto.item.id,
      ...createInventoryDto,
    });
    return this.inventoryRepository.save(inventory);
  }

  async findAll() {
    const inventory = await this.inventoryRepository.find({
      relations: ['item'],
      select: {
        item: {
          id: true,
          name: true,
          unit: true,
        },
      },
    });
    return inventory;
  }

  async findOne(id: number) {
    const inventory = await this.inventoryRepository.findOneBy({id});
    if (inventory) return inventory;
    this.throwNotFoundError();
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.preload({
      id,
      ...updateInventoryDto,
    });
    if (inventory) {
      await this.inventoryRepository.save(inventory);
    }
  }
}
