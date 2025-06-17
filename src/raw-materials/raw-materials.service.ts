import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RawMaterial } from './entities/raw-material.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RawMaterialsService {

  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawmaterialRepository: Repository<RawMaterial>,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException("Matéria Prima não encontrada")
  }

  async create(createRawMaterialDto: CreateRawMaterialDto) {
    const raw = this.rawmaterialRepository.create(createRawMaterialDto);
    return this.rawmaterialRepository.save(raw);
  }

  async findAll() {
    const raws = await this.rawmaterialRepository.find();
    return raws;
  }

  async findOne(id: number) {
    const raw = await this.rawmaterialRepository.findOneBy({id});
    if (raw) return raw;
    this.throwNotFoundError();
  }

  async update(id: number, updateRawMaterialDto: UpdateRawMaterialDto) {
    const raw = await this.rawmaterialRepository.preload({
      id,
      ...updateRawMaterialDto
    });
    if (raw) return this.rawmaterialRepository.save(raw);
    this.throwNotFoundError()
  }

  async remove(id: number) {
    const raw = await this.rawmaterialRepository.findOneBy({id});
    if (raw) return this.rawmaterialRepository.remove(raw);
    this.throwNotFoundError();
  }
}
