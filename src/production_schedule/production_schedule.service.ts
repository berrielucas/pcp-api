import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionScheduleDto } from './dto/create-production_schedule.dto';
import { UpdateProductionScheduleDto } from './dto/update-production_schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionSchedule } from './entities/production_schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionScheduleService {
  constructor (
    @InjectRepository(ProductionSchedule)
    private readonly productScheduleRepository: Repository<ProductionSchedule>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException("Atividade não encontrada")
  }

  async create(createProductionScheduleDto: CreateProductionScheduleDto) {
    const schedule = this.productScheduleRepository.create(createProductionScheduleDto);
    return this.productScheduleRepository.save(schedule);
  }

  async findAll() {
    const schedules = await this.productScheduleRepository.find();
    return schedules;
  }

  async findOne(id: number) {
    const schedule = await this.productScheduleRepository.find({
      where: {
        id,
      }
    });
    if (schedule?.length) return schedule[0];
    this.throwNotFoundError();
   }

  async update(id: number, updateProductionScheduleDto: UpdateProductionScheduleDto) {
    const schedule = await this.productScheduleRepository.preload({
      id,
      ...updateProductionScheduleDto,
    });
    if (schedule) await this.productScheduleRepository.save(schedule);
    return this.findOne(id)
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    if (schedule) return this.productScheduleRepository.remove(schedule);
    this.throwNotFoundError();
  }

  async findByWhere(where: object) {
    return this.productScheduleRepository.findBy(where);
  }
}
