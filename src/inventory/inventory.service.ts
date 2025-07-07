import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
          min_stock_limit: true,
        },
      },
    });
    return inventory;
  }

  async findOne(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['item']
    });
    if (inventory) return inventory;
    this.throwNotFoundError();
  }

  async findByItemId(itemId: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: itemId },
      relations: ['item']
    });
    return inventory;
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

  async increaseStock(itemId: number, quantity: number) {
    const inventory = await this.findByItemId(itemId);
    if (!inventory) {
      throw new NotFoundException(`Inventário não encontrado para o item ${itemId}`);
    }

    inventory.quantity = Number(inventory.quantity) + Number(quantity);
    return this.inventoryRepository.save(inventory);
  }

  async decreaseStock(itemId: number, quantity: number) {
    const inventory = await this.findByItemId(itemId);
    if (!inventory) {
      throw new NotFoundException(`Inventário não encontrado para o item ${itemId}`);
    }

    const newQuantity = Number(inventory.quantity) - Number(quantity);
    if (newQuantity < 0) {
      throw new BadRequestException(`Estoque insuficiente para o item ${inventory.item.name}. Disponível: ${inventory.quantity}, Solicitado: ${quantity}`);
    }

    inventory.quantity = newQuantity;
    return this.inventoryRepository.save(inventory);
  }

  async checkStockAvailability(itemId: number, requiredQuantity: number): Promise<boolean> {
    const inventory = await this.findByItemId(itemId);
    if (!inventory) {
      return false;
    }
    return Number(inventory.quantity) >= Number(requiredQuantity);
  }

  async getItemsBelowMinStock() {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.item', 'item')
      .where('inventory.quantity < item.min_stock_limit')
      .andWhere('item.min_stock_limit > 0')
      .getMany();
  }
}
