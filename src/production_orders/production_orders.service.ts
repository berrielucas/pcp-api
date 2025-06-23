import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionOrderDto } from './dto/create-production_order.dto';
import { UpdateProductionOrderDto } from './dto/update-production_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production_order.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ItemsService } from 'src/items/items.service';
import { AlertsService } from 'src/alerts/alerts.service';
import { ProductionPerformanceService } from 'src/production_performance/production_performance.service';
import { ProductionScheduleService } from 'src/production_schedule/production_schedule.service';
import { DateService } from 'src/common/services/date.service';

@Injectable()
export class ProductionOrdersService {

  constructor (
    @InjectRepository(ProductionOrder)
    private readonly productionOrdersRepository: Repository<ProductionOrder>,
    private readonly userService: UserService,
    private readonly itemService: ItemsService,
    private readonly alertService: AlertsService,
    private readonly productionScheduleService: ProductionScheduleService,
    private readonly productionPerformanceService: ProductionPerformanceService,
    private readonly dateService: DateService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException("Ordem de Produção não encontrada")
  }

  async create(createProductionOrderDto: CreateProductionOrderDto) {
    const { manager_id, item_id, approved_quantity, deadline, quantity, status } = createProductionOrderDto;
    
    const manager = await this.userService.findOne(manager_id);
    const item = await this.itemService.findOne(item_id);

    let partialCreateDto = {
      deadline,
      quantity,
      status
    }

    if (status === 'in_progress') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          start_time: new Date(),
          end_time: null,
        }
      }
    }

    if (status === 'finished') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          end_time: new Date(),
        }
      }
    }

    const production_order = this.productionOrdersRepository.create({
      manager,
      item,
      ...partialCreateDto
    });

    const schedules = await this.productionScheduleService.findByWhere({
      production_order : {
        id: production_order.id
      },
      status: In(['pending', 'started'])
    });

    if (production_order.status === 'finished' && schedules?.length) {
      throw new BadRequestException("A ordem não pode ser finalizada, pois tem atividades não concluídas");
    }

    await this.productionOrdersRepository.save(production_order);

    if (production_order.status === 'finished' && approved_quantity) {
      const quality = parseFloat(((approved_quantity / production_order.quantity) * 100).toFixed(2));
      const planned_time = this.dateService.difference(new Date(production_order.createdAt), new Date(production_order.deadline));
      const real_time = this.dateService.difference(new Date(production_order.start_time), new Date(production_order.end_time));
      const efficiency = parseFloat(((real_time.hours / planned_time.hours) * 100).toFixed(2));
      const productivity = (production_order.quantity / real_time.hours);

      await this.productionPerformanceService.create({
        production_order,
        efficiency,
        productivity,
        quality,
      });
    }

    return this.findOne(production_order.id)
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
    if (production_order?.length) return production_order[0];
    this.throwNotFoundError();
  }

  async update(id: number, updateProductionOrderDto: UpdateProductionOrderDto) {
    const { manager_id, item_id, status, deadline, quantity, approved_quantity } = updateProductionOrderDto;

    let partialUpdateDto = {
      status,
      deadline,
      quantity,
    }

    
    if (status === 'in_progress') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          start_time: new Date(),
          end_time: null,
        }
      }
    }

    if (status === 'finished') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          end_time: new Date(),
        }
      }
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
      const schedules = await this.productionScheduleService.findByWhere({
        production_order : {
          id: production_order.id
        },
        status: In(['pending', 'started'])
      });

      if (production_order.status === 'finished' && schedules?.length) {
        throw new BadRequestException("A ordem não pode ser finalizada, pois tem atividades não concluídas");
      }

      await this.productionOrdersRepository.save(production_order);

      if (production_order.status === 'finished' && approved_quantity) {
        const quality = parseFloat(((approved_quantity / production_order.quantity) * 100).toFixed(2));
        const planned_time = this.dateService.difference(new Date(production_order.createdAt), new Date(production_order.deadline));
        const real_time = this.dateService.difference(new Date(production_order.start_time), new Date(production_order.end_time));
        const efficiency = parseFloat(((real_time.hours / planned_time.hours) * 100).toFixed(2));
        const productivity = (production_order.quantity / real_time.hours);
  
        await this.productionPerformanceService.create({
          production_order,
          efficiency,
          productivity,
          quality,
        });
      }
    }
    
    return this.findOne(id);
  }

  async remove(id: number) {
    const production_order = await this.findOne(id);
    if (production_order) return this.productionOrdersRepository.remove(production_order);
    this.throwNotFoundError();
  }
}
