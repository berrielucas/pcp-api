import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductionScheduleDto } from './dto/create-production_schedule.dto';
import { UpdateProductionScheduleDto } from './dto/update-production_schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionSchedule } from './entities/production_schedule.entity';
import { Repository } from 'typeorm';
import { MachinesService } from 'src/machines/machines.service';
import { UserService } from 'src/user/user.service';
import { ProductionOrder } from 'src/production_orders/entities/production_order.entity';

@Injectable()
export class ProductionScheduleService {
  constructor(
    @InjectRepository(ProductionSchedule)
    private readonly productScheduleRepository: Repository<ProductionSchedule>,
    private readonly machinesService: MachinesService,
    private readonly userService: UserService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Atividade não encontrada');
  }

  async create(createProductionScheduleDto: CreateProductionScheduleDto) {
    const schedule = this.productScheduleRepository.create(
      createProductionScheduleDto,
    );
    return this.productScheduleRepository.save(schedule);
  }

  async findAll() {
    const schedules = await this.productScheduleRepository.find({
      relations: ['production_order', 'machine', 'operator'],
    });
    return schedules;
  }

  async findOne(id: number) {
    const schedule = await this.productScheduleRepository.findOne({
      where: { id },
      relations: ['production_order', 'machine', 'operator'],
    });
    if (schedule) return schedule;
    this.throwNotFoundError();
  }

  async update(
    id: number,
    updateProductionScheduleDto: UpdateProductionScheduleDto,
  ) {
    const schedule = await this.productScheduleRepository.preload({
      id,
      ...updateProductionScheduleDto,
    });
    if (schedule) await this.productScheduleRepository.save(schedule);
    return this.findOne(id);
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    if (schedule) return this.productScheduleRepository.remove(schedule);
    this.throwNotFoundError();
  }

  async findByWhere(where: object) {
    return this.productScheduleRepository.findBy(where);
  }

  async createForOrder(
    production_order: ProductionOrder,
    createProductionScheduleDto: CreateProductionScheduleDto,
  ) {

    const machine = await this.machinesService.findOne(
      createProductionScheduleDto.machine_id,
    );

    const operator = await this.userService.findOne(
      createProductionScheduleDto.operator_id,
    );

    await this.checkMachineAvailability(
      createProductionScheduleDto.machine_id,
      createProductionScheduleDto.start_time,
      createProductionScheduleDto.end_time,
    );

    await this.checkOperatorAvailability(
      createProductionScheduleDto.operator_id,
      createProductionScheduleDto.start_time,
      createProductionScheduleDto.end_time,
    );

    const scheduleData = {
      ...createProductionScheduleDto,
      production_order,
      machine,
      operator,
    };

    const schedule = this.productScheduleRepository.create(scheduleData);
    return this.productScheduleRepository.save(schedule);
  }

  async findAllByOrder(productionOrderId: number) {
    return this.productScheduleRepository.find({
      where: { production_order: { id: productionOrderId } },
      relations: ['production_order', 'machine', 'operator'],
    });
  }

  async findOneByOrder(productionOrderId: number, scheduleId: number) {
    const schedule = await this.productScheduleRepository.findOne({
      where: {
        id: scheduleId,
        production_order: { id: productionOrderId },
      },
      relations: ['production_order', 'machine', 'operator'],
    });

    if (schedule) return schedule;
    this.throwNotFoundError();
  }

  async updateForOrder(
    production_order: ProductionOrder,
    scheduleId: number,
    updateProductionScheduleDto: UpdateProductionScheduleDto,
  ) {

    let partialUpdateDto = {
      ...updateProductionScheduleDto
    }

    const existingSchedule = await this.findOneByOrder(
      production_order.id,
      scheduleId,
    );

    if (updateProductionScheduleDto.machine_id) {
      const machine = await this.machinesService.findOne(
        updateProductionScheduleDto.machine_id,
      );
      partialUpdateDto = {
        ...{ machine },
        ...partialUpdateDto
      }
    }

    if (updateProductionScheduleDto.operator_id) {
      const operator = await this.userService.findOne(updateProductionScheduleDto.operator_id);
      partialUpdateDto = {
        ...{ operator },
        ...partialUpdateDto
      }
    }

    if (
      existingSchedule &&
      (updateProductionScheduleDto.start_time ||
        updateProductionScheduleDto.end_time ||
        updateProductionScheduleDto.machine_id ||
        updateProductionScheduleDto.operator_id)
    ) {
      const machineId =
        updateProductionScheduleDto.machine_id || existingSchedule.machine.id;
      const operatorId =
        updateProductionScheduleDto.operator_id || existingSchedule.operator.id;
      const startTime =
        updateProductionScheduleDto.start_time || existingSchedule.start_time;
      const endTime =
        updateProductionScheduleDto.end_time || existingSchedule.end_time;

      await this.checkMachineAvailability(
        machineId,
        startTime,
        endTime,
        scheduleId,
      );
      await this.checkOperatorAvailability(
        operatorId,
        startTime,
        endTime,
        scheduleId,
      );
    }

    const schedule = await this.productScheduleRepository.preload({
      id: scheduleId,
      ...partialUpdateDto,
    });

    if (schedule) await this.productScheduleRepository.save(schedule);
    return this.findOneByOrder(production_order.id, scheduleId);
  }

  async removeForOrder(productionOrderId: number, scheduleId: number) {
    const schedule = await this.findOneByOrder(productionOrderId, scheduleId);
    if (schedule) return this.productScheduleRepository.remove(schedule);
  }

  private async checkMachineAvailability(
    machineId: number,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: number,
  ) {
    if (!startTime || !endTime) return;

    const conflictingSchedules = await this.productScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.machine_id = :machineId', { machineId })
      .andWhere('schedule.status != :cancelledStatus', {
        cancelledStatus: 'cancelled',
      })
      .andWhere(
        '(schedule.start_time < :endTime AND schedule.end_time > :startTime)',
        { startTime, endTime },
      );

    if (excludeScheduleId) {
      conflictingSchedules.andWhere('schedule.id != :excludeScheduleId', {
        excludeScheduleId,
      });
    }

    const conflicts = await conflictingSchedules.getMany();

    if (conflicts.length > 0) {
      throw new BadRequestException(
        'Máquina não está disponível no horário solicitado',
      );
    }
  }

  private async checkOperatorAvailability(
    operatorId: number,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: number,
  ) {
    if (!startTime || !endTime) return;

    const conflictingSchedules = await this.productScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.operator_id = :operatorId', { operatorId })
      .andWhere('schedule.status != :cancelledStatus', {
        cancelledStatus: 'cancelled',
      })
      .andWhere(
        '(schedule.start_time < :endTime AND schedule.end_time > :startTime)',
        { startTime, endTime },
      );

    if (excludeScheduleId) {
      conflictingSchedules.andWhere('schedule.id != :excludeScheduleId', {
        excludeScheduleId,
      });
    }

    const conflicts = await conflictingSchedules.getMany();

    if (conflicts.length > 0) {
      throw new BadRequestException(
        'Operador não está disponível no horário solicitado',
      );
    }
  }
}
