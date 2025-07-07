import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { InventoryService } from 'src/inventory/inventory.service';
import { ItemMaterialsService } from 'src/item_materials/item_materials.service';
import { CreateProductionScheduleDto } from 'src/production_schedule/dto/create-production_schedule.dto';
import { UpdateProductionScheduleDto } from 'src/production_schedule/dto/update-production_schedule.dto';

@Injectable()
export class ProductionOrdersService {
  constructor(
    @InjectRepository(ProductionOrder)
    private readonly productionOrdersRepository: Repository<ProductionOrder>,
    private readonly userService: UserService,
    private readonly itemService: ItemsService,
    private readonly alertService: AlertsService,
    private readonly productionScheduleService: ProductionScheduleService,
    private readonly productionPerformanceService: ProductionPerformanceService,
    private readonly dateService: DateService,
    private readonly inventoryService: InventoryService,
    private readonly itemMaterialsService: ItemMaterialsService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Ordem de Produção não encontrada');
  }

  async create(createProductionOrderDto: CreateProductionOrderDto) {
    const {
      manager_id,
      item_id,
      approved_quantity,
      deadline,
      quantity,
      status,
    } = createProductionOrderDto;

    const manager = await this.userService.findOne(manager_id);
    const item = await this.itemService.findOne(item_id);

    let partialCreateDto = {
      deadline: new Date(deadline),
      quantity,
      status,
    };

    if (status === 'pending') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          start_time: null,
          end_time: null,
        },
      };
    }

    if (status === 'in_progress') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          start_time: new Date(),
          end_time: null,
        },
      };
    }

    if (status === 'finished') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          end_time: new Date(),
          approved_quantity,
        },
      };
    }

    if (status !== 'finished') {
      partialCreateDto = {
        ...partialCreateDto,
        ...{
          approved_quantity: null,
        },
      };
    }

    const production_order = this.productionOrdersRepository.create({
      manager,
      item,
      ...partialCreateDto,
    });

    const schedules = await this.productionScheduleService.findByWhere({
      production_order: {
        id: production_order.id,
      },
      status: In(['pending', 'started']),
    });

    if (production_order.status === 'finished' && schedules?.length) {
      throw new BadRequestException(
        'A ordem não pode ser finalizada, pois tem atividades não concluídas',
      );
    }

    if (production_order.status === 'finished') {
      await this.handleStockOnOrderCompletion(
        production_order,
        approved_quantity || quantity,
      );
    }

    await this.productionOrdersRepository.save(production_order);

    if (production_order.status === 'finished' && approved_quantity) {
      const quality = parseFloat(
        (
          (production_order.approved_quantity / production_order.quantity) *
          100
        ).toFixed(2),
      );
      const planned_time = this.dateService.difference(
        new Date(production_order.createdAt),
        new Date(production_order.deadline),
      );
      const real_time = this.dateService.difference(
        new Date(production_order.start_time),
        new Date(production_order.end_time),
      );
      const efficiency = parseFloat(
        ((real_time.hours / planned_time.hours) * 100).toFixed(2),
      );
      const productivity = production_order.quantity / real_time.hours;

      await this.productionPerformanceService.create({
        production_order,
        efficiency,
        productivity,
        quality,
      });
    }

    await this.sendOrderAlert(production_order, 'created');

    return this.findOne(production_order.id);
  }

  async findAll() {
    const production_orders = await this.productionOrdersRepository.find({
      relations: [
        'manager',
        'item',
        'item.inventory',
        'item.raw_materials',
        'item.raw_materials.raw_material',
        'performance',
        'schedule',
        'schedule.operator',
        'schedule.machine',
      ],
    });
    return production_orders;
  }

  async findOne(id: number) {
    const production_order = await this.productionOrdersRepository.find({
      where: {
        id,
      },
      relations: [
        'manager',
        'item',
        'item.inventory',
        'item.raw_materials',
        'item.raw_materials.raw_material',
        'performance',
        'schedule',
        'schedule.operator',
        'schedule.machine',
      ],
    });
    if (production_order?.length) return production_order[0];
    this.throwNotFoundError();
  }

  async update(id: number, updateProductionOrderDto: UpdateProductionOrderDto) {
    const {
      manager_id,
      item_id,
      status,
      deadline,
      quantity,
      approved_quantity,
    } = updateProductionOrderDto;

    const currentOrder = await this.findOne(id);
    const previousStatus = currentOrder ? currentOrder.status : null;

    let partialUpdateDto = {
      status,
      quantity,
    };

    if (deadline) {
      partialUpdateDto = {
        ...{
          deadline: new Date(deadline),
        },
        ...partialUpdateDto,
      };
    }

    if (status === 'pending') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          start_time: null,
          end_time: null,
        },
      };
    }

    if (status === 'in_progress') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          start_time: new Date(),
          end_time: null,
        },
      };
    }

    if (status === 'finished') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          end_time: new Date(),
          approved_quantity,
        },
      };
    }

    if (status !== 'finished') {
      partialUpdateDto = {
        ...partialUpdateDto,
        ...{
          approved_quantity: null,
        },
      };
    }

    if (manager_id) {
      const manager = await this.userService.findOne(manager_id);
      if (manager) {
        partialUpdateDto = {
          ...{ manager },
          ...partialUpdateDto,
        };
      }
    }

    if (item_id) {
      const item = await this.itemService.findOne(item_id);
      partialUpdateDto = {
        ...{ item },
        ...partialUpdateDto,
      };
    }

    const production_order = await this.productionOrdersRepository.preload({
      id,
      ...partialUpdateDto,
    });

    if (production_order) {
      const schedules = await this.productionScheduleService.findByWhere({
        production_order: {
          id: production_order.id,
        },
        status: In(['pending', 'started']),
      });

      if (production_order.status === 'finished' && schedules?.length) {
        throw new BadRequestException(
          'A ordem não pode ser finalizada, pois tem atividades não concluídas',
        );
      }

      if (
        previousStatus === 'finished' &&
        status !== 'finished' &&
        currentOrder
      ) {
        await this.handleStockOnOrderReversal(currentOrder);
      }

      if (
        production_order.status === 'finished' &&
        previousStatus !== 'finished' &&
        approved_quantity
      ) {
        await this.handleStockOnOrderCompletion(
          production_order,
          approved_quantity,
        );
      }

      await this.productionOrdersRepository.save(production_order);

      if (production_order.status !== 'finished') {
        await this.productionPerformanceService.deleteByOrder(production_order);
      }

      if (production_order.status === 'finished' && approved_quantity) {
        const quality = parseFloat(
          (
            (production_order.approved_quantity / production_order.quantity) *
            100
          ).toFixed(2),
        );
        const planned_time = this.dateService.difference(
          new Date(production_order.start_time),
          new Date(production_order.deadline),
        );
        const real_time = this.dateService.difference(
          new Date(production_order.start_time),
          new Date(production_order.end_time),
        );
        const efficiency = parseFloat(
          ((real_time.milliseconds / planned_time.milliseconds) * 100).toFixed(
            2,
          ),
        );
        const productivity = parseFloat(
          (
            (production_order.quantity / real_time.milliseconds) *
            1000 *
            60 *
            60
          ).toFixed(2),
        );

        console.log('quality', quality);
        console.log('efficiency', efficiency);
        console.log('productivity', productivity);

        await this.productionPerformanceService.create({
          production_order,
          efficiency,
          productivity,
          quality,
        });
      }

      if (previousStatus !== status) {
        await this.sendOrderAlert(production_order, 'updated');
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const production_order = await this.findOne(id);
    if (production_order)
      return this.productionOrdersRepository.remove(production_order);
    this.throwNotFoundError();
  }

  async createSchedule(
    productionOrderId: number,
    createProductionScheduleDto: CreateProductionScheduleDto,
  ) {
    const order = await this.findOne(productionOrderId);
    if (order)
      return this.productionScheduleService.createForOrder(
        order,
        createProductionScheduleDto,
      );
  }

  async findAllSchedules(productionOrderId: number) {
    await this.findOne(productionOrderId);
    return this.productionScheduleService.findAllByOrder(productionOrderId);
  }

  async findOneSchedule(productionOrderId: number, scheduleId: number) {
    await this.findOne(productionOrderId);
    return this.productionScheduleService.findOneByOrder(
      productionOrderId,
      scheduleId,
    );
  }

  async updateSchedule(
    productionOrderId: number,
    scheduleId: number,
    updateProductionScheduleDto: UpdateProductionScheduleDto,
  ) {
    const order = await this.findOne(productionOrderId);
    if (order)
      return this.productionScheduleService.updateForOrder(
        order,
        scheduleId,
        updateProductionScheduleDto,
      );
  }

  async removeSchedule(productionOrderId: number, scheduleId: number) {
    await this.findOne(productionOrderId);
    return this.productionScheduleService.removeForOrder(
      productionOrderId,
      scheduleId,
    );
  }

  private async handleStockOnOrderCompletion(
    partialOrder: ProductionOrder,
    approvedQuantity: number,
  ) {
    const order = await this.findOne(partialOrder.id);
    if (order) {
      try {
        const itemWithMaterials = await this.itemService.findOne(order.item.id);

        if (
          itemWithMaterials &&
          itemWithMaterials.raw_materials &&
          itemWithMaterials.raw_materials.length > 0
        ) {
          for (const material of itemWithMaterials.raw_materials) {
            const requiredQuantity =
              Number(material.quantity) * Number(approvedQuantity);
            await this.inventoryService.decreaseStock(
              material.raw_material.id,
              requiredQuantity,
            );
          }
        }

        await this.inventoryService.increaseStock(
          order.item.id,
          approvedQuantity,
        );

        await this.checkAndAlertLowStock();
      } catch (error) {
        console.error('Erro ao processar estoque:', error);

        await this.alertService.create({
          message: `Erro ao processar estoque para a ordem ${order.id}: ${error.message}`,
          user: order.manager,
          alert_type: 'error',
        });
        throw error;
      }
    }
  }

  private async handleStockOnOrderReversal(partialOrder: ProductionOrder) {
    const order = await this.findOne(partialOrder.id);
    if (order) {
      try {
        const itemWithMaterials = await this.itemService.findOne(order.item.id);

        let approvedQuantity = order.quantity;
        if (order.performance && order.performance.quality) {
          approvedQuantity = Math.round(
            (order.quantity * order.performance.quality) / 100,
          );
        }

        if (
          itemWithMaterials &&
          itemWithMaterials.raw_materials &&
          itemWithMaterials.raw_materials.length > 0
        ) {
          for (const material of itemWithMaterials.raw_materials) {
            const requiredQuantity =
              Number(material.quantity) * Number(approvedQuantity);
            await this.inventoryService.increaseStock(
              material.raw_material.id,
              requiredQuantity,
            );
          }
        }

        await this.inventoryService.decreaseStock(
          order.item.id,
          approvedQuantity,
        );
      } catch (error) {
        console.error('Erro ao reverter estoque:', error);
        await this.alertService.create({
          message: `Erro ao reverter estoque para a ordem ${order.id}: ${error.message}`,
          user: order.manager,
          alert_type: 'error',
        });
        throw error;
      }
    }
  }

  private async checkAndAlertLowStock() {
    try {
      const itemsBelowMinStock =
        await this.inventoryService.getItemsBelowMinStock();

      if (itemsBelowMinStock.length > 0) {
        const admins = await this.userService.findAdmins();

        for (const item of itemsBelowMinStock) {
          const message = `O item "${item.item.name}" está com estoque baixo. Quantidade atual: ${item.quantity}, Limite mínimo: ${item.item.min_stock_limit}`;

          for (const admin of admins) {
            await this.alertService.create({
              message,
              user: admin,
              alert_type: 'inventory_low',
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar estoque baixo:', error);
    }
  }

  private async sendOrderAlert(
    partialOrder: ProductionOrder,
    action: 'created' | 'updated' | 'completed',
  ) {
    const order = await this.findOne(partialOrder.id);
    if (order) {
      try {
        let title = '';
        let message = '';

        switch (action) {
          case 'created':
            title = 'Nova Ordem de Produção';
            message = `Uma nova ordem de produção foi criada para o item "${order.item.name}". Quantidade: ${order.quantity}, Status: ${order.status}`;
            break;
          case 'updated':
            title = 'Ordem de Produção Atualizada';
            message = `A ordem de produção #${order.id} foi atualizada. Item: "${order.item.name}", Status: ${order.status}`;
            break;
          case 'completed':
            title = 'Ordem de Produção Concluída';
            message = `A ordem de produção #${order.id} foi concluída. Item: "${order.item.name}", Quantidade: ${order.quantity}`;
            break;
        }

        await this.alertService.create({
          message,
          user: order.manager,
          alert_type: 'order_update',
        });
      } catch (error) {
        console.error('Erro ao enviar alerta:', error);
      }
    }
  }
}
