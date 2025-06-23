import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionPerformanceDto } from './dto/create-production_performance.dto';
import { UpdateProductionPerformanceDto } from './dto/update-production_performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductionPerformance } from './entities/production_performance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionPerformanceService {
  constructor (
    @InjectRepository(ProductionPerformance)
    private readonly productionPerformanceRepository: Repository<ProductionPerformance>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException("Desempenho não encontrada")
  }

  async create(createProductionPerformanceDto: CreateProductionPerformanceDto) {
    const performance = this.productionPerformanceRepository.create(createProductionPerformanceDto);
    return this.productionPerformanceRepository.save(performance);
  }

  async findAll() {
    const performances = await this.productionPerformanceRepository.find();
    return performances;
  }

  async findOne(id: number) {
    const performance = await this.productionPerformanceRepository.findOneBy({id});
    if (performance) return performance;
  }

  async update(id: number, updateProductionPerformanceDto: UpdateProductionPerformanceDto) {
    const performance = await this.productionPerformanceRepository.preload({
      id,
      ...updateProductionPerformanceDto,
    });
    if (performance) return this.productionPerformanceRepository.save(performance);
  }

  async remove(id: number) {
    const performance = await this.findOne(id);
    if (performance) return this.productionPerformanceRepository.remove(performance);
  }
}
