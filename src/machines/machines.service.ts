import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) { }

  throwNotFoundError() {
    throw new NotFoundException("Máquina não encontrada");
  }

  async create(createMachineDto: CreateMachineDto) {
    const machine = this.machineRepository.create(createMachineDto);
    return this.machineRepository.save(machine);
  }

  async findAll() {
    const machines = await this.machineRepository.find();
    return machines;
  }

  async findOne(id: number) {
    const machine = await this.machineRepository.findOneBy({id});
    if (machine) return machine;
    this.throwNotFoundError()
  } 

  async update(id: number, updateMachineDto: UpdateMachineDto) {
    const machine = await this.machineRepository.preload({
      id,
      ...updateMachineDto,
    });
    if (machine) return this.machineRepository.save(machine);
    this.throwNotFoundError();
  }

  async remove(id: number) {
    const machine = await this.findOne(id);
    if (machine) return this.machineRepository.remove(machine);
  }
}
