import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionOrderDto } from './dto/create-production_order.dto';
import { UpdateProductionOrderDto } from './dto/update-production_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production_order.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ItemsService } from 'src/items/items.service';
import { AlertsService } from 'src/alerts/alerts.service';

@Injectable()
export class ProductionOrdersService {

  constructor (
    @InjectRepository(ProductionOrder)
    private readonly productionOrdersRepository: Repository<ProductionOrder>,
    private readonly userService: UserService,
    private readonly itemService: ItemsService,
    private readonly alertService: AlertsService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException("Ordem de Produção não encontrada")
  }

  async create(createProductionOrderDto: CreateProductionOrderDto) {
    const { manager_id, item_id, ...partialCreateDto } = createProductionOrderDto;
    
    const manager = await this.userService.findOne(manager_id);
    const item = await this.itemService.findOne(item_id);

    const production_order = this.productionOrdersRepository.create({
      manager,
      item,
      ...partialCreateDto
    });

    return this.productionOrdersRepository.save(production_order);
  }

  async findAll() {
    const production_orders = await this.productionOrdersRepository.find();
    return production_orders;
  }

  async findOne(id: number) {
    const production_order = await this.productionOrdersRepository.find({
      where: {
        id,
      },
    });
    return production_order[0];
  }

  async update(id: number, updateProductionOrderDto: UpdateProductionOrderDto) {
    const { manager_id, item_id, status, deadline, quantity } = updateProductionOrderDto;

    let partialUpdateDto = {
      status,
      deadline,
      quantity,
    }

    if (manager_id) {
      const manager = await this.userService.findOne(manager_id);
      if (manager) {
        partialUpdateDto = {
          ...{ manager },
          ...partialUpdateDto,
        }
      }
    }

    if (item_id) {
      const item = await this.itemService.findOne(item_id);
      partialUpdateDto = {
        ...{ item },
        ...partialUpdateDto,
      }
    }

    const production_order = await this.productionOrdersRepository.preload({
      id,
      ...partialUpdateDto
    });
    if (production_order) {
      await this.productionOrdersRepository.save(production_order);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const production_order = await this.findOne(id);
    if (production_order) return this.productionOrdersRepository.remove(production_order);
    this.throwNotFoundError();
  }
}
